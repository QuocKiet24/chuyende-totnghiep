import AddressSelector from "@/components/shopping/address-select";
import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddress,
  deleteAddress,
  fetchAllAddress,
  editAddress,
} from "@/store/shop/address-slice";
import { toast } from "sonner";
import AddressCard from "./address-card";

const initialFormData = {
  address: "",
  province: "",
  district: "",
  ward: "",
  phone: "",
  notes: "",
};

const Address = ({ setCurrentSelectedAddress, selectedId }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [address, setAddress] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressSelectorKey, setAddressSelectorKey] = useState(0);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);
  const handleAddressChange = (selectedAddress) => {
    if (!selectedAddress) return; // Kiểm tra nếu selectedAddress là null hoặc undefined

    setFormData((prev) => ({
      ...prev,
      province: selectedAddress.province,
      district: selectedAddress.district,
      ward: selectedAddress.ward,
    }));
    setAddress(selectedAddress);
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const resetForm = () => {
    setFormData(initialFormData);
    setAddress(null);
    setCurrentEditedId(null);
    setAddressSelectorKey((prev) => prev + 1);
  };

  const handleSubmitAddress = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (addressList.length >= 3 && currentEditedId === null) {
      setFormData(initialFormData);
      toast.error("Bạn chỉ được thêm tối đa 3 địa chỉ");
      setIsSubmitting(false);
      return;
    }

    if (!address || !isFormValid()) {
      toast.error("Vui lòng điền đầy đủ thông tin.");
      setIsSubmitting(false);
      return;
    }

    if (!validatePhone(formData.phone)) {
      toast.error("Số điện thoại không hợp lệ");
      setIsSubmitting(false);
      return;
    }

    try {
      const action = currentEditedId
        ? editAddress({
            userId: user?._id,
            addressId: currentEditedId,
            formData,
          })
        : addNewAddress({ ...formData, userId: user?._id });

      const result = await dispatch(action);

      if (result?.payload?.success) {
        await dispatch(fetchAllAddress(user?._id));
        resetForm();
        toast.success(
          currentEditedId
            ? "Cập nhật địa chỉ thành công"
            : "Thêm địa chỉ thành công"
        );
      }

      console.log("Sending formData:", {
        userId: user?._id,
        ...formData,
      });
    } catch (error) {
      console.log(error);
      toast.error("Đã xảy ra lỗi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAddress = async (getCurrentAddress) => {
    try {
      const result = await dispatch(
        deleteAddress({ userId: user?._id, addressId: getCurrentAddress._id })
      );

      if (result?.payload?.success) {
        await dispatch(fetchAllAddress(user?._id));
        toast.success("Xóa địa chỉ thành công");
      } else {
        throw new Error();
      }
    } catch (error) {
      console.log(error);
      toast.error("Xóa địa chỉ thất bại");
    }
  };

  const handleEditAddress = (getCurrentAddress) => {
    setCurrentEditedId(getCurrentAddress?._id);
    setFormData({
      address: getCurrentAddress?.address || "",
      province: getCurrentAddress?.province || "",
      district: getCurrentAddress?.district || "",
      ward: getCurrentAddress?.ward || "",
      phone: getCurrentAddress?.phone || "",
      notes: getCurrentAddress?.notes || "",
    });

    setAddress({
      province: getCurrentAddress?.province || "",
      district: getCurrentAddress?.district || "",
      ward: getCurrentAddress?.ward || "",
    });
    setAddressSelectorKey((prev) => prev + 1);
  };

  const isFormValid = () => {
    const requiredFields = ["address", "province", "district", "ward", "phone"];
    const isValid = requiredFields.every(
      (field) => formData[field]?.trim() !== ""
    );

    return isValid;
  };

  const validatePhone = (phone) => {
    const regex = /^(0|\+84)[1-9][0-9]{8}$/;
    return regex.test(phone);
  };

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchAllAddress(user?._id));
    }
  }, [dispatch, user?._id]);

  return (
    <Card>
      <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {addressList?.map((singleAddressItem) => (
          <AddressCard
            key={singleAddressItem._id}
            selectedId={selectedId}
            addressInfo={singleAddressItem}
            handleDeleteAddress={handleDeleteAddress}
            handleEditAddress={handleEditAddress}
            setCurrentSelectedAddress={setCurrentSelectedAddress}
          />
        ))}
      </div>

      <CardHeader>
        <CardTitle className="text-lg md:text-xl font-semibold text-gray-800">
          {currentEditedId !== null ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmitAddress} className="space-y-5">
          <div className="space-y-4">
            <AddressSelector
              key={`address-selector-${addressSelectorKey}`}
              value={address}
              onAddressChange={handleAddressChange}
            />

            <div>
              <label className="block text-sm font-medium mb-1">
                Địa chỉ chi tiết <span className="text-red-500">*</span>
              </label>
              <Input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="VD: 123 Nguyễn Văn Cừ"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="VD: 0987654321"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Ghi chú</label>
              <Textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Ghi chú cho người giao hàng..."
              />
            </div>
          </div>

          <div className="flex gap-2">
            {currentEditedId && (
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={resetForm}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
            )}
            <Button
              type="submit"
              className={`flex-1 ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting || !isFormValid()}
            >
              {isSubmitting
                ? "Đang xử lý..."
                : currentEditedId
                ? "Cập nhật"
                : "Thêm mới"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default Address;
