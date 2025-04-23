import React from "react";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import CartItem from "./cart-content";
import { formatVnd } from "@/utils/formatVnd";
import { useNavigate, useParams } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useTranslation } from "react-i18next";

const Cartwrapper = ({ cartItems, setOpenCartSheet }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { locale } = useParams();

  const totalCartAmount = cartItems?.reduce(
    (sum, item) => sum + (item?.salePrice || item?.price) * item.quantity,
    0
  );

  return (
    <SheetContent className="sm:max-w-lg w-full h-full flex flex-col p-6">
      <SheetHeader className="border-b pb-4">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          <SheetTitle className="text-lg font-semibold">
            {t("cart.title")}
          </SheetTitle>
        </div>
      </SheetHeader>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        {cartItems?.length > 0 ? (
          cartItems.map((item) => (
            <CartItem key={item.productId} cartItem={item} />
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
            <ShoppingCart className="w-12 h-12 mb-4" />
            <p className="text-lg">{t("cart.empty")}</p>
            <p className="text-sm">{t("cart.ptag")}</p>
          </div>
        )}
      </div>

      {/* Checkout Section */}
      {cartItems?.length > 0 && (
        <div className="border-t pt-4 space-y-4">
          <div className="flex justify-between text-sm">
            <span> {t("cart.subtotal")}</span>
            <span>{formatVnd(totalCartAmount)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span> {t("cart.total")}</span>
            <span className="text-primary">{formatVnd(totalCartAmount)}</span>
          </div>

          <Button
            onClick={() => {
              navigate(`/${locale}/shop/checkout`);
              setOpenCartSheet(false);
            }}
            className="w-full py-6 text-md font-bold"
          >
            {t("cart.btn")}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            {t("cart.freeship")}
          </p>
        </div>
      )}
    </SheetContent>
  );
};

export default Cartwrapper;
