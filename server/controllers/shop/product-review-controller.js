import Order from "../../models/Order.js";
import Product from "../../models/Product.js";
import ProductReview from "../../models/Review.js";

export const addProductReview = async (req, res) => {
  try {
    const { productId, userId, userName, reviewMessage, reviewValue } =
      req.body;

    // Kiểm tra user đã mua sản phẩm hay chưa
    const order = await Order.findOne({
      userId,
      "cartItems.productId": productId,
      orderStatus: { $in: ["confirmed", "delivered"] },
    });

    if (!order) {
      return res.status(403).json({
        success: false,
        message: "You need to purchase the product to review it.",
      });
    }

    // Kiểm tra user đã đánh giá sản phẩm chưa
    const existingReview = await ProductReview.findOne({ productId, userId });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this product!",
      });
    }

    // Tạo review mới
    const newReview = new ProductReview({
      productId,
      userId,
      userName,
      reviewMessage,
      reviewValue,
    });

    await newReview.save();

    // Tính toán lại averageReview cho sản phẩm
    const reviews = await ProductReview.find({ productId });
    const total = reviews.reduce((sum, r) => sum + r.reviewValue, 0);
    const averageReview = parseFloat((total / reviews.length).toFixed(1));

    // Cập nhật product
    await Product.findByIdAndUpdate(productId, {
      averageReview,
      totalReviews: reviews.length,
    });

    res.status(201).json({
      success: true,
      data: newReview,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Server error while adding review",
    });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await ProductReview.find({ productId });
    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};
