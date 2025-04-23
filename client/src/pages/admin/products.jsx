import ProductCard from "@/components/admin/productcard";
import CommonForm from "@/components/common/form";
import ProductImageUpload from "@/components/common/image-upload";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAddProductFormElements } from "@/config";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const inititalFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
};

const AdminProducts = () => {
  const { t } = useTranslation();
  const [openCreateProductDialog, setOpenCreateProductDialog] = useState(false);
  const [formData, setFormData] = useState(inititalFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const dispatch = useDispatch();
  const { productList } = useSelector((state) => state.adminProducts);

  function onSubmit(event) {
    event.preventDefault();

    currentEditedId !== null
      ? dispatch(
          editProduct({
            id: currentEditedId,
            formData,
          })
        ).then((data) => {
          console.log(data, "edit");

          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setFormData(inititalFormData);
            setOpenCreateProductDialog(false);
            setCurrentEditedId(null);
            toast.success("Edited product successfully");
          }
        })
      : dispatch(
          addNewProduct({
            ...formData,
            image: uploadedImageUrl,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setOpenCreateProductDialog(false);
            setImageFile(null);
            setFormData(inititalFormData);
            toast.success("Added product successfully");
          }
        });
  }

  function handleDelete(getCurrentProductId) {
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        toast.success("Deleted product successfully");
      }
    });
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  console.log(productList, "productList");

  return (
    <Fragment>
      <div className="flex items-center justify-between mb-6 px-4 md:px-6">
        <h1 className="text-2xl font-bold">{t("admin.createProduct.h1")}</h1>
        <Button onClick={() => setOpenCreateProductDialog(true)}>
          + {t("admin.createProduct.h1")}
        </Button>
      </div>

      <div className="px-4 md:px-6 pb-10">
        {productList && productList.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {productList.map((productItem) => (
              <ProductCard
                key={productItem._id}
                setFormData={setFormData}
                setOpenCreateProductDialog={setOpenCreateProductDialog}
                setCurrentEditedId={setCurrentEditedId}
                product={productItem}
                handleDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground mt-10">
            {t("admin.createProduct.noProducts")}
          </div>
        )}
      </div>

      <Sheet
        open={openCreateProductDialog}
        onOpenChange={() => setOpenCreateProductDialog(false)}
      >
        <SheetContent side="right" className="overflow-y-auto max-w-md w-full">
          <SheetHeader>
            <SheetTitle>{t("admin.createProduct.h1")}</SheetTitle>
          </SheetHeader>

          <div className="py-4">
            <ProductImageUpload
              imageFile={imageFile}
              setImageFile={setImageFile}
              uploadedImageUrl={uploadedImageUrl}
              setUploadedImageUrl={setUploadedImageUrl}
              setImageLoadingState={setImageLoadingState}
              imageLoadingState={imageLoadingState}
            />
          </div>

          <CommonForm
            onSubmit={onSubmit}
            formControls={useAddProductFormElements()}
            formData={formData}
            setFormData={setFormData}
            buttonText={t("admin.createProduct.confirm")}
          />
        </SheetContent>
      </Sheet>
    </Fragment>
  );
};

export default AdminProducts;
