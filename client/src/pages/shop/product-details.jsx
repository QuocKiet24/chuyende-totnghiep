import StarRatingComponent from "@/components/common/star-rating";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
  setProductDetails,
} from "@/store/shop/products-slice";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { formatVnd } from "@/utils/formatVnd";
import { StarIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const ProductDetailsDialog = ({
  open,
  setOpen,
  productDetails,
  filters,
  sort,
}) => {
  const { i18n, t } = useTranslation();
  const lang = i18n.language || "en";

  const [rating, setRating] = useState(0);
  const [reviewMsg, setReviewMsg] = useState("");
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);

  const discountPercentage =
    productDetails?.salePrice > 0
      ? Math.round(
          ((productDetails.price - productDetails.salePrice) /
            productDetails.price) *
            100
        )
      : 0;

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });
          return;
        }
      }
    }
    dispatch(
      addToCart({
        userId: user?._id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?._id));
        toast.success("Added To Cart");
      }
    });
  }

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
  }

  function handleAddReview() {
    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?._id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((action) => {
      if (addReview.fulfilled.match(action)) {
        toast.success("Review added successfully!");
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id));
        dispatch(fetchProductDetails(productDetails?._id));
        dispatch(
          fetchAllFilteredProducts({ filterParams: filters, sortParams: sort })
        );
      } else if (addReview.rejected.match(action)) {
        const errorMessage = action.payload?.message || action.error?.message;

        if (errorMessage.includes("purchase product")) {
          toast.error("You need to purchase this product before reviewing it.");
        } else if (errorMessage.includes("already reviewed")) {
          toast.error("You have already reviewed this product!");
        } else {
          toast.error(errorMessage || "Failed to add review");
        }
      }
    });
  }

  const averageReview = productDetails?.averageReview || 0;
  const reviewCount = productDetails?.totalReviews || 0;

  useEffect(() => {
    if (productDetails !== null) dispatch(getReviews(productDetails?._id));
  }, [productDetails]);

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogTitle></DialogTitle>
      <DialogContent className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 sm:p-6 md:p-8 max-w-[95vw] sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] xl:max-w-[60vw]">
        {/* Product Image */}
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={productDetails?.image}
            alt={productDetails?.title?.[lang]}
            className="aspect-square w-full object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="space-y-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
              {productDetails?.title?.[lang]}
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg mb-4 mt-2">
              {productDetails?.description?.[lang]}
            </p>
          </div>

          {/* Price Section */}
          <div className="flex items-center justify-between">
            {productDetails?.salePrice > 0 && (
              <div className="relative">
                <Badge className="absolute -top-4 -right-4 sm:-top-5 sm:-right-5 bg-yellow-500 hover:bg-yellow-600 text-white text-xs sm:text-sm">
                  -{discountPercentage}%
                </Badge>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-red-600">
                  {formatVnd(productDetails?.salePrice)}
                </p>
              </div>
            )}
            <p
              className={`${
                productDetails?.salePrice > 0 ? "line-through" : ""
              } text-lg sm:text-xl md:text-2xl font-bold text-muted-foreground`}
            >
              {formatVnd(productDetails?.price)}
            </p>
          </div>

          {/* Rating Section */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <div className="flex items-center gap-0.5">
                <StarRatingComponent rating={averageReview} />
              </div>
              <span className="text-muted-foreground text-sm sm:text-base">
                ({averageReview.toFixed(1)})
              </span>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base">
              ({reviewCount} {t("reviewcount")})
            </p>
          </div>

          {/* Add to Cart Button */}
          <div className="mt-4">
            {productDetails?.totalStock === 0 ? (
              <Button className="w-full opacity-60 cursor-not-allowed">
                {t("product.outOfStock")}
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={() =>
                  handleAddToCart(
                    productDetails?._id,
                    productDetails?.totalStock
                  )
                }
              >
                {t("product.addToCart")}
              </Button>
            )}
          </div>

          <Separator />

          {/* Reviews Section */}
          <div className="max-h-[200px] sm:max-h-[300px] overflow-auto">
            <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">
              {t("review")}
            </h2>
            <div className="space-y-4">
              {reviews && reviews.length > 0 ? (
                reviews.map((reviewItem, index) => (
                  <div key={index} className="flex gap-3">
                    <Avatar className="w-8 h-8 sm:w-10 sm:h-10 border">
                      <AvatarFallback>
                        {reviewItem?.userName[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm sm:text-base">
                          {reviewItem?.userName}
                        </h3>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <StarRatingComponent rating={reviewItem?.reviewValue} />
                      </div>
                      <p className="text-muted-foreground text-sm sm:text-base">
                        {reviewItem.reviewMessage}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">{t("noreviews")}</p>
              )}
            </div>
          </div>

          {/* Add Review Section */}
          <div className="mt-4 space-y-2">
            <Label className="text-sm sm:text-base">{t("addreview")}</Label>
            <div className="flex gap-1">
              <StarRatingComponent
                rating={rating}
                handleRatingChange={handleRatingChange}
              />
            </div>
            <Input
              name="reviewMsg"
              value={reviewMsg}
              onChange={(e) => setReviewMsg(e.target.value)}
              placeholder={t("writereview")}
              className="text-sm sm:text-base"
            />
            <Button
              onClick={handleAddReview}
              disabled={reviewMsg.trim() === ""}
              className="text-sm sm:text-base"
            >
              {t("submit")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsDialog;
