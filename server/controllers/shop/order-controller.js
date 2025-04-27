import paypal from "../../helpers/paypal.js";
import Order from "../../models/Order.js";
import Cart from "../../models/Cart.js";
import User from "../../models/User.js";
import Product from "../../models/Product.js";
import { sendOrderConfirmationEmail } from "../../helpers/email.js";

export const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus = "pending",
      paymentMethod,
      paymentStatus = "pending",
      totalAmount,
      orderDate = new Date(),
      orderUpdateDate = new Date(),
      paymentId,
      payerId,
      cartId,
      lang = "en-US",
    } = req.body;

    // Validate required fields
    if (
      !userId ||
      !cartItems ||
      !addressInfo ||
      !paymentMethod ||
      !totalAmount
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // For PayPal payment
    if (paymentMethod === "paypal") {
      // Tỉ giá VND -> USD (có thể update theo tỷ giá thực tế)
      const VND_TO_USD_RATE = 25000;
      const amountVND = totalAmount;
      const amountUSD = (amountVND / VND_TO_USD_RATE).toFixed(2);

      if (amountUSD === "0.00") {
        return res.status(400).json({
          success: false,
          message:
            "Total amount must be greater than zero to proceed with payment.",
        });
      }

      const create_payment_json = {
        intent: "sale",
        payer: {
          payment_method: "paypal",
        },
        redirect_urls: {
          return_url: `${process.env.CLIENT_BASE_URL}/${lang}/shop/paypal-return`,
          cancel_url: `${process.env.CLIENT_BASE_URL}/${lang}/shop/paypal-cancel`,
        },
        transactions: [
          {
            item_list: {
              items: cartItems.map((item) => {
                const usdPrice = (item.price / VND_TO_USD_RATE)
                  .toFixed(2)
                  .toString();
                return {
                  name: item.title,
                  sku: item.productId,
                  price: usdPrice,
                  currency: "USD",
                  quantity: item.quantity,
                };
              }),
            },
            amount: {
              currency: "USD",
              total: amountUSD,
            },
            description: "Thanh toán đơn hàng tại cửa hàng Kiệt Store",
          },
        ],
      };

      paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
        if (error) {
          console.error("PayPal error:", JSON.stringify(error, null, 2));
          return res.status(500).json({
            success: false,
            message: "Error while creating paypal payment",
          });
        } else {
          const newlyCreatedOrder = new Order({
            userId,
            cartId,
            cartItems,
            addressInfo,
            orderStatus,
            paymentMethod,
            paymentStatus,
            totalAmount,
            orderDate,
            orderUpdateDate,
            paymentId,
            payerId,
          });
          await newlyCreatedOrder.save();

          const approvalURL = paymentInfo.links.find(
            (link) => link.rel === "approval_url"
          ).href;
          return res.status(201).json({
            success: true,
            approvalURL,
            orderId: newlyCreatedOrder._id,
          });
        }
      });
    } else if (paymentMethod === "cod") {
      const newlyCreatedOrder = new Order({
        userId,
        cartId,
        cartItems,
        addressInfo,
        orderStatus: "pending",
        paymentMethod: "cod",
        paymentStatus: "pending",
        totalAmount,
        orderDate,
        orderUpdateDate,
      });

      await newlyCreatedOrder.save();

      return res.status(201).json({
        success: true,
        redirectUrl: `${process.env.CLIENT_BASE_URL}/${lang}/shop/order-confirmation/${newlyCreatedOrder._id}`,
        orderId: newlyCreatedOrder._id,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Unsupported payment method",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const capturePayment = async (req, res) => {
  try {
    const { orderId, paymentId, payerId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy đơn hàng.", success: false });
    }

    if (order.paymentMethod === "paypal") {
      order.paymentStatus = "paid";
      order.orderStatus = "confirmed";
      order.paymentId = paymentId;
      order.payerId = payerId;
      order.orderUpdateDate = new Date();

      for (let item of order.cartItems) {
        let product = await Product.findById(item.productId);

        if (!product) {
          return res.status(404).json({
            success: false,
            message: `not enough stock for this product ${product.title.en}`,
          });
        }

        product.totalStock -= item.quantity;
        await product.save();
      }

      // Xóa giỏ hàng
      const getCartId = order.cartId;
      await Cart.findByIdAndDelete(getCartId);

      await order.save();

      // Lấy thông tin user
      const user = await User.findById(order.userId);

      if (!user || !user.email) {
        return res
          .status(400)
          .json({ message: "Email không hợp lệ hoặc không có." });
      }

      // Chuẩn bị dữ liệu cho email
      const emailData = {
        orderId: order._id.toString(),
        items: order.cartItems.map((item) => ({
          name: item.title,
          price: Number(item.price).toLocaleString("vi-VN"),
          quantity: item.quantity,
          total: (item.quantity * Number(item.price)).toLocaleString("vi-VN"),
        })),
        subtotal: order.totalAmount.toLocaleString("vi-VN"),
        shipping: "0",
        total: order.totalAmount.toLocaleString("vi-VN"),
        shippingAddress: {
          name: user.name || "Khách hàng",
          address: order.addressInfo.address,
          ward: order.addressInfo.ward || "",
          district: order.addressInfo.district || "",
          province: order.addressInfo.province || "",
          phone: order.addressInfo.phone,
        },
        paymentMethod: order.paymentMethod.toUpperCase(),
        orderDate: new Date(order.orderDate).toLocaleDateString("vi-VN"),
      };

      // Gửi email xác nhận
      try {
        await sendOrderConfirmationEmail(
          user.email,
          user.name || "Khách hàng",
          emailData
        );
      } catch (error) {
        console.error("Error sending confirmation email:", error);
      }

      return res.status(200).json({
        success: true,
        message: "Order Confirmed",
        data: order,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "This order is not a PayPal payment",
      });
    }
  } catch (error) {
    console.error("Lỗi capturePayment:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi khi xử lý thanh toán." });
  }
};

export const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId });

    if (!orders.length) {
      res.status(404).json({
        success: false,
        message: "No orders found",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const confirmCodOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate("userId"); // Populate để lấy user info

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.paymentMethod !== "cod") {
      return res.status(400).json({
        success: false,
        message: "This is not a COD order",
      });
    }

    // Cập nhật trạng thái đơn hàng
    order.orderStatus = "confirmed";
    order.paymentStatus = "pending"; // Vẫn giữ là pending cho đến khi giao hàng thành công
    order.orderUpdateDate = new Date();
    await order.save();

    for (let item of order.cartItems) {
      let product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `not enough stock for this product `,
        });
      }

      product.totalStock -= item.quantity;
      await product.save();
    }
    const getCartId = order.cartId;
    await Cart.findByIdAndDelete(getCartId);

    // Lấy thông tin user
    const user = await User.findById(order.userId);

    if (!user || !user.email) {
      return res
        .status(400)
        .json({ message: "Email không hợp lệ hoặc không có." });
    }

    const emailData = {
      orderId: order._id.toString(),
      items: order.cartItems.map((item) => ({
        name: item.title,
        price: Number(item.price).toLocaleString("vi-VN"),
        quantity: item.quantity,
        total: (item.quantity * Number(item.price)).toLocaleString("vi-VN"),
      })),
      subtotal: order.totalAmount.toLocaleString("vi-VN"),
      shipping: "0",
      total: order.totalAmount.toLocaleString("vi-VN"),
      shippingAddress: {
        name: user.name || "Khách hàng",
        address: order.addressInfo.address,
        ward: order.addressInfo.ward || "",
        district: order.addressInfo.district || "",
        province: order.addressInfo.province || "",
        phone: order.addressInfo.phone,
      },
      paymentMethod: "COD",
      orderDate: new Date(order.orderDate).toLocaleDateString("vi-VN"),
      orderStatus: "confirmed",
    };

    try {
      await sendOrderConfirmationEmail(
        user.email,
        user.name || "Khách hàng",
        emailData
      );
    } catch (error) {
      console.error("Error sending confirmation email:", error);
    }

    res.status(200).json({
      success: true,
      message: "COD order confirmed and email sent",
      data: order,
    });
  } catch (error) {
    console.error("Error confirming COD order:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
