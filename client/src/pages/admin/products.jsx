import ProductCard from "@/components/admin/productcard";
import CommonForm from "@/components/common/form";
import ProductImageUpload from "@/components/common/image-upload";
import NoData from "@/components/common/nodata";
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
  image: "",
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
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const dispatch = useDispatch();
  const { productList } = useSelector((state) => state.adminProducts);

  // Hàm để cập nhật giá trị form từ ProductImageUpload
  const setFieldValue = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  function onSubmit(event) {
    event.preventDefault();

    // Kiểm tra nếu đang edit nhưng không có thay đổi ảnh
    const finalFormData = currentEditedId
      ? { ...formData }
      : { ...formData, image: formData.image };

    if (currentEditedId) {
      dispatch(
        editProduct({ id: currentEditedId, formData: finalFormData })
      ).then((data) => {
        if (data?.payload?.success) {
          resetForm();
          toast.success("Product updated successfully");
        }
      });
    } else {
      dispatch(addNewProduct(finalFormData)).then((data) => {
        if (data?.payload?.success) {
          resetForm();
          toast.success("Product added successfully");
        }
      });
    }
  }

  function handleDelete(getCurrentProductId) {
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        toast.success("Product deleted successfully");
      }
    });
  }

  // Reset form sau khi thành công
  const resetForm = () => {
    setFormData(inititalFormData);
    setImageFile(null);
    setCurrentEditedId(null);
    setOpenCreateProductDialog(false);
    dispatch(fetchAllProducts());
  };

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  return (
    <Fragment>
      <div className="flex items-center justify-between mb-6 px-4 md:px-6">
        <h1 className="text-2xl font-bold">{t("admin.createProduct.h1")}</h1>
        <Button
          onClick={() => {
            setOpenCreateProductDialog(true);
            setCurrentEditedId(null);
            setFormData(inititalFormData);
          }}
        >
          + {t("admin.createProduct.h1")}
        </Button>
      </div>

      <div className="px-4 md:px-6 pb-10">
        {productList?.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {productList.map((productItem) => (
              <ProductCard
                key={productItem._id}
                product={productItem}
                handleEdit={() => {
                  setOpenCreateProductDialog(true);
                  setCurrentEditedId(productItem._id);
                  setFormData({
                    image: productItem.image,
                    title: productItem.title,
                    description: productItem.description,
                    category: productItem.category,
                    brand: productItem.brand,
                    price: productItem.price,
                    salePrice: productItem.salePrice,
                    totalStock: productItem.totalStock,
                  });
                }}
                handleDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <NoData text={t("noproduct")} />
        )}
      </div>

      <Sheet
        open={openCreateProductDialog}
        onOpenChange={(open) => {
          if (!open) {
            resetForm();
          }
        }}
      >
        <SheetContent side="right" className="overflow-y-auto max-w-md w-full">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId
                ? t("admin.editProduct")
                : t("admin.createProduct.h1")}
            </SheetTitle>
          </SheetHeader>

          <div className="py-4">
            <ProductImageUpload
              imageFile={imageFile}
              setImageFile={setImageFile}
              uploadedImageUrl={formData.image}
              setUploadedImageUrl={(url) => setFieldValue("image", url)}
              setImageLoadingState={setImageLoadingState}
              imageLoadingState={imageLoadingState}
              isEditMode={!!currentEditedId}
              setFieldValue={setFieldValue}
            />
          </div>

          <CommonForm
            onSubmit={onSubmit}
            formControls={useAddProductFormElements()}
            formData={formData}
            setFormData={setFormData}
            buttonText={
              currentEditedId
                ? t("admin.update")
                : t("admin.createProduct.confirm")
            }
          />
        </SheetContent>
      </Sheet>
    </Fragment>
  );
};

export default AdminProducts;
