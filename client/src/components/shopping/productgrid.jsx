import React from "react";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { formatVnd } from "@/utils/formatVnd";
import { Star, ShoppingCart, Zap } from "lucide-react";
import StarRatingComponent from "../common/star-rating";

const ProductGrid = ({ product, handleGetProductDetails, handleAddToCart }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage || "en-US";

  const discountPercentage =
    product?.salePrice > 0
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : 0;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
    hover: { scale: 1.03 },
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  const averageReview = product?.averageReview || 0;
  const reviewCount = product?.totalReviews || 0;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      whileHover="hover"
      variants={cardVariants}
      className="w-full max-w-sm mx-auto"
    >
      <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        {/* Product Image with Badges */}
        <div
          className="relative cursor-pointer"
          onClick={() => handleGetProductDetails(product._id)}
        >
          <motion.img
            src={product?.image}
            alt={product?.title?.[lang]}
            className="w-full h-[300px] object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            {product?.totalStock === 0 ? (
              <Badge variant="destructive" className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                {t("product.outOfStock")}
              </Badge>
            ) : product?.totalStock < 10 ? (
              <Badge variant="destructive" className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                {`Only ${product?.totalStock} left`}
              </Badge>
            ) : product?.salePrice > 0 ? (
              <Badge
                variant="secondary"
                className="bg-primary text-primary-foreground"
              >
                {t("product.sale")}
              </Badge>
            ) : null}
          </div>

          {discountPercentage > 0 && (
            <Badge className="absolute top-2 right-2 bg-yellow-500 hover:bg-yellow-600 text-white">
              -{discountPercentage}%
            </Badge>
          )}
        </div>

        {/* Product Content */}
        <CardHeader className="p-4 pb-0">
          <h3
            className="text-lg font-bold truncate cursor-pointer"
            onClick={() => handleGetProductDetails(product._id)}
          >
            {product?.title?.[lang]}
          </h3>
          <p className="text-sm text-muted-foreground uppercase">
            {product?.brand}
          </p>
        </CardHeader>

        <CardContent className="p-4 pt-0">
          <div className="flex items-center gap-2">
            <div className="flex items-center mt-2 gap-1">
              <StarRatingComponent rating={averageReview} />
              <span className="text-muted-foreground text-sm">
                ({averageReview})
              </span>
            </div>
          </div>
          <p className="text-muted-foreground mt-2 ">
            ({reviewCount} {t("reviewcount")})
          </p>
          {/* Pricing */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-baseline gap-2">
              {product?.salePrice > 0 ? (
                <>
                  <span className="text-lg font-bold text-red-600">
                    {formatVnd(product.salePrice)}
                  </span>
                  <span className="text-sm line-through text-muted-foreground">
                    {formatVnd(product.price)}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold text-primary">
                  {formatVnd(product?.price)}
                </span>
              )}
            </div>
          </div>
        </CardContent>

        {/* Add to Cart Button */}
        <CardFooter className="p-4 pt-0">
          <motion.div
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            className="w-full"
          >
            {product?.totalStock === 0 ? (
              <Button disabled className="w-full opacity-75">
                <ShoppingCart className="h-4 w-4 mr-2" />
                {t("product.outOfStock")}
              </Button>
            ) : (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(product?._id, product?.totalStock);
                }}
                className="w-full"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {t("product.addToCart")}
              </Button>
            )}
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProductGrid;
