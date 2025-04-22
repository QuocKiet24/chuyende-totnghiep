import AddressSelector from "@/components/shopping/address-select";
import React, { useState } from "react";

const ShoppingAccount = () => {
  const [address, setAddress] = useState(null);

  const handleAddressChange = (selectedAddress) => {
    console.log("Địa chỉ đã chọn:", selectedAddress);
    setAddress(selectedAddress);
  };
  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Chọn địa chỉ giao hàng</h2>
      <AddressSelector onAddressChange={handleAddressChange} />

      {address && (
        <div className="mt-4 p-4 border rounded">
          <h3 className="font-semibold">Địa chỉ đã chọn:</h3>
          <p>{address.fullAddress}</p>
        </div>
      )}
    </div>
  );
};

export default ShoppingAccount;
