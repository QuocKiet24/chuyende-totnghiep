import Address from "../../models/Address";

export const addAddress = async (req, res) => {
  try {
    const { userId, address, province, district, ward, phone, notes } =
      req.body;

    // Validation
    if (!userId || !address || !province || !district || !ward || !phone) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin bắt buộc",
      });
    }
    const newAddress = new Address({
      userId,
      address,
      province,
      district,
      ward,
      phone,
      notes: notes || "",
    });

    await newAddress.save();

    return res.status(201).json({
      success: true,
      data: newAddress,
    });
  } catch (error) {
    console.error("Lỗi khi thêm địa chỉ:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi thêm địa chỉ",
    });
  }
};

export const fetchAllAddress = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu ID người dùng",
      });
    }

    const addressList = await Address.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: addressList,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách địa chỉ:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy địa chỉ",
    });
  }
};

export const editAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const formData = req.body;

    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu ID người dùng hoặc ID địa chỉ",
      });
    }

    const updatedAddress = await Address.findOneAndUpdate(
      { _id: addressId, userId },
      formData,
      { new: true, runValidators: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy địa chỉ",
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedAddress,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật địa chỉ:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật địa chỉ",
    });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;

    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu ID người dùng hoặc ID địa chỉ",
      });
    }

    const deletedAddress = await Address.findOneAndDelete({
      _id: addressId,
      userId,
    });

    if (!deletedAddress) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy địa chỉ để xóa",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Xóa địa chỉ thành công",
      data: deletedAddress,
    });
  } catch (error) {
    console.error("Lỗi khi xóa địa chỉ:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi xóa địa chỉ",
    });
  }
};
