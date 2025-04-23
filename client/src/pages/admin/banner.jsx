import ProductImageUpload from "@/components/common/image-upload";
import { Button } from "@/components/ui/button";
import {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImage,
} from "@/store/common-slice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import NoData from "@/components/common/nodata";

const BannerDashboard = () => {
  const { t } = useTranslation();
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const dispatch = useDispatch();
  const { featureImageList, isLoading } = useSelector(
    (state) => state.commonFeature
  );

  function handleUploadFeatureImage() {
    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl("");
      }
    });
  }

  function handleDeleteFeatureImage(id) {
    if (window.confirm(t("admin.banner.deleteConfirm"))) {
      dispatch(deleteFeatureImage(id)).then((data) => {
        if (data?.payload?.success) {
          dispatch(getFeatureImages());
        }
      });
    }
  }

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div>
      <ProductImageUpload
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploadedImageUrl={uploadedImageUrl}
        setUploadedImageUrl={setUploadedImageUrl}
        setImageLoadingState={setImageLoadingState}
        imageLoadingState={imageLoadingState}
        isCustomStyling={true}
      />
      <Button
        onClick={handleUploadFeatureImage}
        className="mt-5 w-full"
        disabled={!uploadedImageUrl || isLoading}
      >
        {isLoading ? t("admin.banner.btnLoading") : t("admin.banner.btnText")}
      </Button>

      <div className="flex flex-col gap-4 mt-5">
        {featureImageList && featureImageList.length > 0 ? (
          featureImageList.map((featureImgItem) => (
            <div key={featureImgItem._id} className="relative group">
              <img
                src={featureImgItem.image}
                className="w-full h-[300px] object-cover rounded-lg"
                alt={`Feature ${featureImgItem._id}`}
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleDeleteFeatureImage(featureImgItem._id)}
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            <NoData text={t("admin.banner.noData")} />
          </p>
        )}
      </div>
    </div>
  );
};

export default BannerDashboard;
