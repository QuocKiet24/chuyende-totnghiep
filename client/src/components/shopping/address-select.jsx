import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getProvinces, getDistricts, getWards } from "vietnam-provinces";

const AddressSelector = ({ onAddressChange }) => {
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  // Load tất cả tỉnh/thành phố
  const allProvinces = getProvinces();

  // Khi chọn tỉnh/thành phố
  useEffect(() => {
    if (selectedProvince) {
      const provinceDistricts = getDistricts(selectedProvince);
      setDistricts(provinceDistricts);
      setSelectedDistrict("");
      setSelectedWard("");
    }
  }, [selectedProvince]);

  // Khi chọn quận/huyện
  useEffect(() => {
    if (selectedDistrict) {
      const districtWards = getWards(selectedDistrict);
      setWards(districtWards);
      setSelectedWard("");
    }
  }, [selectedDistrict]);

  // Gửi dữ liệu địa chỉ đã chọn ra ngoài component
  useEffect(() => {
    if (selectedProvince && selectedDistrict && selectedWard) {
      const province = allProvinces.find((p) => p.code === selectedProvince);
      const district = districts.find((d) => d.code === selectedDistrict);
      const ward = wards.find((w) => w.code === selectedWard);

      onAddressChange({
        province: province.name,
        district: district.name,
        ward: ward.name,
        fullAddress: `${ward.name}, ${district.name}, ${province.name}`,
      });
    }
  }, [selectedProvince, selectedDistrict, selectedWard]);

  return (
    <div className="space-y-4">
      {/* Chọn Tỉnh/Thành phố */}
      <div>
        <label className="block text-sm font-medium mb-1">Tỉnh/Thành phố</label>
        <Select onValueChange={setSelectedProvince} value={selectedProvince}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn tỉnh/thành phố" />
          </SelectTrigger>
          <SelectContent>
            {allProvinces.map((province) => (
              <SelectItem key={province.code} value={province.code}>
                {province.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Chọn Quận/Huyện */}
      <div>
        <label className="block text-sm font-medium mb-1">Quận/Huyện</label>
        <Select
          onValueChange={setSelectedDistrict}
          value={selectedDistrict}
          disabled={!selectedProvince}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn quận/huyện" />
          </SelectTrigger>
          <SelectContent>
            {districts.map((district) => (
              <SelectItem key={district.code} value={district.code}>
                {district.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Chọn Phường/Xã */}
      <div>
        <label className="block text-sm font-medium mb-1">Phường/Xã</label>
        <Select
          onValueChange={setSelectedWard}
          value={selectedWard}
          disabled={!selectedDistrict}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn phường/xã" />
          </SelectTrigger>
          <SelectContent>
            {wards.map((ward) => (
              <SelectItem key={ward.code} value={ward.code}>
                {ward.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default AddressSelector;
