import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getProvinces, getDistricts, getWards } from "vietnam-provinces";

const AddressSelector = ({ onAddressChange, value }) => {
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const allProvinces = getProvinces();

  // Helper functions
  const findByCode = (list, code) => list.find((item) => item.code === code);
  const findByName = (list, name) => list.find((item) => item.name === name);

  // Handle default value from props
  useEffect(() => {
    if (!value) return; // Dừng nếu `value` là null hoặc undefined
    if (value.province && value.district && value.ward) {
      const provinceMatch = findByName(allProvinces, value.province);
      if (provinceMatch) {
        setSelectedProvince(provinceMatch.code);
        const provinceDistricts = getDistricts(provinceMatch.code);
        setDistricts(provinceDistricts);

        const districtMatch = findByName(provinceDistricts, value.district);
        if (districtMatch) {
          setSelectedDistrict(districtMatch.code);
          const districtWards = getWards(districtMatch.code);
          setWards(districtWards);

          const wardMatch = findByName(districtWards, value.ward);
          if (wardMatch) {
            setSelectedWard(wardMatch.code);
          }
        }
      }
    }
  }, [value]);

  useEffect(() => {
    if (selectedProvince) {
      const provinceDistricts = getDistricts(selectedProvince);
      setDistricts(provinceDistricts);

      setSelectedDistrict("");
      setWards([]);
      setSelectedWard("");
    }
  }, [selectedProvince]);

  // Load wards when district changes
  useEffect(() => {
    if (selectedDistrict) {
      const districtWards = getWards(selectedDistrict);
      setWards(districtWards);
      setSelectedWard("");
    }
  }, [selectedDistrict]);

  useEffect(() => {
    const province = allProvinces.find((p) => p.code === selectedProvince);
    const provinceDistricts = selectedProvince
      ? getDistricts(selectedProvince)
      : [];
    const district = provinceDistricts.find((d) => d.code === selectedDistrict);
    const districtWards = selectedDistrict ? getWards(selectedDistrict) : [];
    const ward = districtWards.find((w) => w.code === selectedWard);

    if (province && district && ward) {
      onAddressChange({
        province: province.name,
        district: district.name,
        ward: ward.name,
        fullAddress: `${ward.name}, ${district.name}, ${province.name}`,
      });
    } else {
      // Gửi null nếu chưa đầy đủ hoặc không hợp lệ
      onAddressChange(null);
    }
  }, [selectedProvince, selectedDistrict, selectedWard]);

  return (
    <div className="space-y-4">
      {/* Province */}
      <div>
        <label className="block text-sm font-medium mb-1">Tỉnh/Thành phố</label>
        <Select onValueChange={setSelectedProvince} value={selectedProvince}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn tỉnh/thành phố" />
          </SelectTrigger>
          <SelectContent>
            {allProvinces.map((province) => (
              <SelectItem key={String(province.code)} value={province.code}>
                {province.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* District */}
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
              <SelectItem key={String(district.code)} value={district.code}>
                {district.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Ward */}
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
              <SelectItem key={String(ward.code)} value={ward.code}>
                {ward.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Display full address */}
      {selectedProvince && selectedDistrict && selectedWard && (
        <p className="text-sm text-muted-foreground mt-2">
          Địa chỉ: {findByCode(wards, selectedWard)?.name},{" "}
          {findByCode(districts, selectedDistrict)?.name},{" "}
          {findByCode(allProvinces, selectedProvince)?.name}
        </p>
      )}
    </div>
  );
};

export default AddressSelector;
