import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { capturePayment } from "@/store/shop/order-slice";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const PaypalReturnPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paymentId = params.get("paymentId");
  const payerId = params.get("PayerID");
  const { locale } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (paymentId && payerId) {
      const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));

      dispatch(capturePayment({ paymentId, payerId, orderId })).then((data) => {
        if (data?.payload?.success) {
          sessionStorage.removeItem("currentOrderId");
          navigate(`/${locale}/shop/payment-success`);
        }
      });
    }
  }, [paymentId, payerId, dispatch, locale]);

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

export default PaypalReturnPage;
