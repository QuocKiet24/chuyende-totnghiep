import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";

const ProductCard = ({
  product,
  setFormData,
  setOpenCreateProductDialog,
  setCurrentEditedId,
  handleDelete,
}) => {
  const { i18n } = useTranslation();
  const lang = i18n.language || "en";

  const handleEdit = () => {
    setOpenCreateProductDialog(true);
    setCurrentEditedId?.(product?._id);
    setFormData(product);
  };

  return (
    <Card className="w-full max-w-sm mx-auto shadow-sm hover:shadow-md transition-all duration-300">
      {/* Image */}
      <div className="relative">
        <img
          src={product?.image}
          alt={product?.title?.[lang]}
          className="w-full h-60 object-cover rounded-t-lg"
        />
      </div>

      {/* Content */}
      <CardContent>
        <h2 className="text-lg font-semibold mb-1 line-clamp-2 h-[48px]">
          {product?.title?.[lang]}
        </h2>

        <div className="flex items-center justify-between">
          <span
            className={`text-base font-medium ${
              product?.salePrice > 0
                ? "line-through text-muted-foreground"
                : "text-primary"
            }`}
          >
            ₫{product?.price?.toLocaleString()}
          </span>

          {product?.salePrice > 0 && (
            <span className="text-base font-semibold text-red-600">
              ₫{product?.salePrice?.toLocaleString()}
            </span>
          )}
        </div>
      </CardContent>

      {/* Actions */}
      <CardFooter className="flex justify-end gap-2">
        <Button size="sm" onClick={handleEdit}>
          Edit
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => handleDelete?.(product?._id)}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
