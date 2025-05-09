import React from "react";
import { DialogContent, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { formatVnd } from "@/utils/formatVnd";
import { useTranslation } from "react-i18next";

const ShoppingOrderDetailsView = ({ orderDetails }) => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth);
  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogTitle className="sr-only">Order Details</DialogTitle>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="flex mt-6 items-center justify-between">
            <p className="font-medium">ID</p>
            <Label>{orderDetails?._id}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">{t("admin.order.date")}</p>
            <Label>
              {" "}
              {new Date(orderDetails?.orderDate).toLocaleDateString("vi-VN")}
            </Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">{t("admin.order.price")}</p>
            <Label>{formatVnd(orderDetails?.totalAmount)}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">{t("admin.order.method")}</p>
            <Label>{orderDetails?.paymentMethod}</Label>
          </div>

          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">{t("admin.order.status")}</p>
            <Label>
              <Badge
                className={`py-1 px-3 ${
                  orderDetails?.orderStatus === "confirmed"
                    ? "bg-green-500"
                    : orderDetails?.orderStatus === "rejected"
                    ? "bg-red-600"
                    : "bg-black"
                }`}
              >
                {orderDetails?.orderStatus}
              </Badge>
            </Label>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">{t("admin.order.details")}</div>
            <ul className="grid gap-3">
              {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
                ? orderDetails?.cartItems.map((item) => (
                    <li
                      key={item?.productId}
                      className="flex items-center justify-between"
                    >
                      <span>
                        {t("admin.order.title")}: {item.title}
                      </span>
                      <span>
                        {t("admin.order.quantity")}: {item.quantity}
                      </span>
                      <span>
                        {t("admin.order.price")}: {item.price} đ
                      </span>
                    </li>
                  ))
                : null}
            </ul>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">{t("admin.order.shippingInfo")}</div>
            <div className="grid gap-0.5 text-muted-foreground">
              <span>{user.userName}</span>
              <span>{orderDetails?.addressInfo?.address}</span>
              <span>{orderDetails?.addressInfo?.city}</span>
              <span>{orderDetails?.addressInfo?.pincode}</span>
              <span>{orderDetails?.addressInfo?.phone}</span>
              <span>{orderDetails?.addressInfo?.notes}</span>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
};

export default ShoppingOrderDetailsView;
