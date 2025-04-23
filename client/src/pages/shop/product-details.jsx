import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { setProductDetails } from "@/store/shop/products-slice";
import { formatVnd } from "@/utils/formatVnd";
import { StarIcon } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const ProductDetailsDialog = ({ open, setOpen, productDetails }) => {
  const { i18n } = useTranslation();
  const lang = i18n.language || "en";
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);

  const handleDialogClose = () => {
    setOpen(false);
    dispatch(setProductDetails());
  };

  const handleAddToCart = (getCurrentProductId, getTotalStock) => {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast.error(
            `Only ${getQuantity} quantity can be added for this item`
          );

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
        toast.success("Added to Cart");
      }
    });
  };
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
            <p className="text-muted-foreground text-2xl mb-5 mt-4">
              {productDetails?.description?.[lang]}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p
              className={`${
                productDetails?.salePrice > 0 ? "line-through" : ""
              } text-3xl font-bold text-primary`}
            >
              {formatVnd(productDetails?.price)}
            </p>
            {productDetails?.salePrice > 0 && (
              <p className="text-2xl font-bold text-red-600">
                {formatVnd(productDetails?.salePrice)}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5 mt-2">
              <StarIcon className="size-5 fill-primary" />
              <StarIcon className="size-5 fill-primary" />
              <StarIcon className="size-5 fill-primary" />
              <StarIcon className="size-5 fill-primary" />
              <StarIcon className="size-5 fill-primary" />
              <span className="text-muted-foreground">(4.5)</span>
            </div>
          </div>
          <div className="mt-5 mb-5">
            {productDetails?.totalStock === 0 ? (
              <Button className="w-full opacity-60 cursor-not-allowed">
                Out of Stock
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
                Add to Cart
              </Button>
            )}
          </div>
          <Separator />
          <div className="max-h-[300px] overflow-auto">
            <h2 className="text-xl font-bold mb-4 mt-4">Reviews</h2>
            <div className="grid gap-6">
              <div className="flex gap-4">
                <Avatar className="size-10 border">
                  <AvatarFallback>Kiet</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">Kiet tran</h3>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <StarIcon className="size-5 fill-primary" />
                    <StarIcon className="size-5 fill-primary" />
                    <StarIcon className="size-5 fill-primary" />
                    <StarIcon className="size-5 fill-primary" />
                    <StarIcon className="size-5 fill-primary" />
                  </div>
                  <p className="text-muted-foreground">This is a comment</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Avatar className="size-10 border">
                  <AvatarFallback>Kiet</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">Kiet tran</h3>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <StarIcon className="size-5 fill-primary" />
                    <StarIcon className="size-5 fill-primary" />
                    <StarIcon className="size-5 fill-primary" />
                    <StarIcon className="size-5 fill-primary" />
                    <StarIcon className="size-5 fill-primary" />
                  </div>
                  <p className="text-muted-foreground">This is a comment</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Avatar className="size-10 border">
                  <AvatarFallback>Kiet</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">Kiet tran</h3>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <StarIcon className="size-5 fill-primary" />
                    <StarIcon className="size-5 fill-primary" />
                    <StarIcon className="size-5 fill-primary" />
                    <StarIcon className="size-5 fill-primary" />
                    <StarIcon className="size-5 fill-primary" />
                  </div>
                  <p className="text-muted-foreground">This is a comment</p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <Input placeholder="Write a review..." />
              <Button>Submit</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsDialog;
