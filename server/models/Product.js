import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    image: String,
    title: {
      vi: { type: String, required: true }, // Tiêu đề tiếng Việt
      en: { type: String, required: true }, // Tiêu đề tiếng Anh
    },
    description: {
      vi: { type: String, required: true }, // Mô tả tiếng Việt
      en: { type: String, required: true }, // Mô tả tiếng Anh
    },
    category: {
      vi: { type: String, required: true }, // Danh mục tiếng Việt
      en: { type: String, required: true }, // Danh mục tiếng Anh
    },
    brand: {
      vi: { type: String, required: true }, // Thương hiệu tiếng Việt
      en: { type: String, required: true }, // Thương hiệu tiếng Anh
    },
    price: { type: Number, required: true },
    salePrice: { type: Number, required: true },
    totalStock: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Product", ProductSchema);
