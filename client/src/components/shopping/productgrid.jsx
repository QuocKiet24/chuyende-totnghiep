import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";
import { formatVnd } from "@/utils/formatVnd";

const ProductGrid = ({ product, handleGetProductDetails }) => {
  const { i18n } = useTranslation();
  const lang = i18n.language || "en";

  const discountPercentage =
    product?.salePrice > 0
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : 0;

  return (
    <Card className="w-full max-w-sm mx-auto">
      <div onClick={() => handleGetProductDetails(product._id)}>
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title?.[lang]}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />

          {product?.totalStock === 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Out Of Stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              {`Only ${product?.totalStock} left`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Sale
            </Badge>
          ) : null}

          {discountPercentage > 0 && (
            <Badge className="absolute top-2 right-2 bg-yellow-500 hover:bg-yellow-600 text-white">
              -{discountPercentage}%
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2">{product?.title?.[lang]}</h2>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground uppercase">
              {product?.brand}
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span
              className={`${
                product?.salePrice > 0 ? "line-through" : ""
              } text-lg font-bold text-primary`}
            >
              {formatVnd(product?.price)}
            </span>
            {product?.salePrice > 0 && (
              <span className="text-lg font-bold text-red-600">
                {formatVnd(product?.salePrice)}
              </span>
            )}
          </div>
        </CardContent>
      </div>
      <CardFooter>
        {product?.totalStock === 0 ? (
          <Button className="w-full opacity-60 cursor-not-allowed">
            Out of Stock
          </Button>
        ) : (
          <Button className="w-full">Add to Cart</Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProductGrid;
