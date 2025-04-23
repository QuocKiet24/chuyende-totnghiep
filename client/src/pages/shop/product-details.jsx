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
    console.log(getRating, "getRating");

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

  console.log(productDetails);

  const averageReview = productDetails?.averageReview || 0;
  const reviewCount = productDetails?.totalReviews || 0;

  useEffect(() => {
    if (productDetails !== null) dispatch(getReviews(productDetails?._id));
  }, [productDetails]);

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogTitle></DialogTitle>
      <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={productDetails?.image}
            alt={productDetails?.title?.[lang]}
            width={600}
            height={600}
            className="aspect-square w-full object-cover"
          />
        </div>
        <div>
          <div>
            <h1 className="text-3xl font-extrabold">
              {productDetails?.title?.[lang]}
            </h1>
            <p className="text-muted-foreground text-2xl mb-8 mt-4">
              {productDetails?.description?.[lang]}
            </p>
          </div>
          <div className="flex items-center justify-between relative">
            {productDetails?.salePrice > 0 && (
              <div className="relative">
                <Badge className="absolute -top-5 -right-5 bg-yellow-500 hover:bg-yellow-600 text-white">
                  -{discountPercentage}%
                </Badge>
                <p className="text-2xl font-bold text-red-600">
                  {formatVnd(productDetails?.salePrice)}
                </p>
              </div>
            )}
            <p
              className={`${
                productDetails?.salePrice > 0 ? "line-through" : ""
              } text-3xl font-bold text-muted-foreground`}
            >
              {formatVnd(productDetails?.price)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center  mt-2">
              <div className="flex items-center gap-0.5">
                <StarRatingComponent rating={averageReview} />
              </div>
              <span className="text-muted-foreground">
                ({averageReview.toFixed(1)})
              </span>
            </div>
            <p className="text-muted-foreground mt-2 ">
              ({reviewCount} {t("reviewcount")})
            </p>
          </div>
          <div className="mt-5 mb-5">
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
          <div className="max-h-[300px] overflow-auto">
            <h2 className="text-xl font-bold mb-4 mt-4"> {t("review")}</h2>
            <div className="grid gap-6">
              {reviews && reviews.length > 0 ? (
                reviews.map((reviewItem) => (
                  <div className="flex gap-4">
                    <Avatar className="w-10 h-10 border">
                      <AvatarFallback>
                        {reviewItem?.userName[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{reviewItem?.userName}</h3>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <StarRatingComponent rating={reviewItem?.reviewValue} />
                      </div>
                      <p className="text-muted-foreground">
                        {reviewItem.reviewMessage}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <h1>No Reviews</h1>
              )}
            </div>
            <div className="mt-10 flex-col flex gap-2">
              <Label> {t("addreview")}</Label>
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
              />
              <Button
                onClick={handleAddReview}
                disabled={reviewMsg.trim() === ""}
              >
                {t("submit")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsDialog;
