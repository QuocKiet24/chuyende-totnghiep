import React, { useState } from "react";
import Address from "@/components/shopping/address";
import { useDispatch, useSelector } from "react-redux";
import CartItem from "@/components/shopping/cart-content";
import { formatVnd } from "@/utils/formatVnd";
import { Button } from "@/components/ui/button";
import { createNewOrder } from "@/store/shop/order-slice";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const ShoppingCheckout = () => {
  const { i18n } = useTranslation();
  const lang = i18n.resolvedLanguage || "en-US";

  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("paypal");

  const totalCartAmount =
    cartItems && cartItems?.items?.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem.quantity,
          0
        )
      : 0;

  const handleCheckout = () => {
    if (!cartItems?.items?.length) {
      toast.error("Giỏ hàng rỗng.");
      return;
    }

    if (currentSelectedAddress === null) {
      toast.error("Chọn 1 địa chỉ để thanh toán.");
      return;
    }

    const commonOrderData = {
      userId: user?._id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title?.[lang],
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      lang,
    };

    if (paymentMethod === "paypal") {
      const paypalOrderData = {
        ...commonOrderData,
        orderStatus: "pending",
        paymentMethod: "paypal",
        paymentStatus: "pending",
        paymentId: "",
        payerId: "",
      };
      dispatch(createNewOrder(paypalOrderData)).then((data) => {
        if (data?.payload?.success) {
          setIsPaymentStart(true);
        } else {
          setIsPaymentStart(false);
        }
      });
    } else if (paymentMethod === "cod") {
      const codOrderData = {
        ...commonOrderData,
        orderStatus: "pending",
        paymentMethod: "cod",
        paymentStatus: "pending",
      };
      dispatch(createNewOrder(codOrderData)).then((data) => {
        if (data?.payload?.success) {
          const redirectUrl = data?.payload?.redirectUrl;
          if (redirectUrl) {
            window.location.href = redirectUrl;
          }
        } else {
          toast.error("Đặt hàng thất bại!");
        }
      });
    }
  };

  if (approvalURL) {
    window.location.href = approvalURL;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Address Section */}
        <Card>
          <CardHeader>
            <CardTitle>Địa chỉ giao hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <Address
              selectedId={currentSelectedAddress}
              setCurrentSelectedAddress={setCurrentSelectedAddress}
            />
          </CardContent>
        </Card>

        {/* Order Summary Section */}
        <Card>
          <CardHeader>
            <CardTitle>Đơn hàng của bạn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Cart Items */}
              <div className="space-y-4">
                {cartItems && cartItems.items && cartItems.items.length > 0 ? (
                  cartItems.items.map((item) => (
                    <CartItem key={item.productId} cartItem={item} />
                  ))
                ) : (
                  <p className="text-muted-foreground">
                    Không có sản phẩm nào trong giỏ hàng
                  </p>
                )}
              </div>

              {/* Payment Method */}
              <div className="space-y-3">
                <h3 className="font-medium">Phương thức thanh toán</h3>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal">PayPal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod">Thanh toán khi nhận hàng (COD)</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Order Total */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <span>{formatVnd(totalCartAmount)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Tổng cộng:</span>
                  <span>{formatVnd(totalCartAmount)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                disabled={totalCartAmount === 0 || isPaymentStart}
                onClick={handleCheckout}
                className="w-full mt-4 py-6 text-lg"
                size="lg"
              >
                {isPaymentStart && paymentMethod === "paypal"
                  ? "Đang xử lý thanh toán PayPal..."
                  : paymentMethod === "cod"
                  ? "Đặt hàng COD"
                  : "Thanh toán với PayPal"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShoppingCheckout;
