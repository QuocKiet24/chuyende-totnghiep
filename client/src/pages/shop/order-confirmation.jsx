import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { confirmCodOrder } from "@/store/shop/order-slice";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const OrderReturnPage = () => {
  const dispatch = useDispatch();
  const { locale } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));
    if (orderId) {
      dispatch(confirmCodOrder(orderId))
        .then((data) => {
          if (data?.payload?.success) {
            sessionStorage.removeItem("currentOrderId");
            window.location.href = `/${locale}/shop/payment-success`;
            toast.success("Đơn hàng COD đã xác nhận thành công!");
          } else {
            toast.error("Xác nhận đơn COD thất bại!");
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [dispatch, locale]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <h1>Loading...</h1>
      </div>
    );
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <CardTitle>Processing Payment...Please wait!</CardTitle>
        </CardTitle>
      </CardHeader>
    </Card>
  );
};

export default OrderReturnPage;
