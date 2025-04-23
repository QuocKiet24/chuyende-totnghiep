import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";
import { Edit, Trash2 } from "lucide-react";

const ProductCard = ({
  product,
  handleEdit, // Thay thế các prop riêng lẻ bằng handleEdit
  handleDelete,
  isLoading = false,
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage || "en-US";

  const priceDisplay = (price) => `₫${price?.toLocaleString() || "0"}`;

  return (
    <Card className="w-full max-w-sm mx-auto shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className="relative group">
        <img
          src={product?.image}
          alt={product?.title?.[lang] || t("product.imageAlt")}
          className="w-full h-60 object-cover rounded-t-lg"
          loading="lazy"
        />

        {product?.salePrice > 0 && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            Sale
          </div>
        )}
      </div>

      <CardContent className="space-y-2">
        <h2 className="text-lg font-semibold line-clamp-2 min-h-[3rem]">
          {product?.title?.[lang] || t("product.noTitle")}
        </h2>

        <div className="flex items-center justify-between">
          <span
            className={`text-base ${
              product?.salePrice > 0
                ? "line-through text-muted-foreground"
                : "text-primary font-medium"
            }`}
          >
            {priceDisplay(product?.price)}
          </span>

          {product?.salePrice > 0 && (
            <span className="text-base font-semibold text-red-600">
              {priceDisplay(product?.salePrice)}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-end gap-2 border-t pt-4">
        <Button
          size="sm"
          variant="outline"
          onClick={handleEdit} // Sử dụng trực tiếp handleEdit
          disabled={isLoading}
          className="flex items-center gap-1"
        >
          <Edit className="h-4 w-4" />
          {t("admin.createProduct.edit")}
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => handleDelete?.(product?._id)}
          disabled={isLoading}
          className="flex items-center gap-1"
        >
          <Trash2 className="h-4 w-4" />
          {t("admin.createProduct.delete")}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
