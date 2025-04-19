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
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    price: { type: Number, required: true },
    salePrice: { type: Number, required: true },
    totalStock: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Product", ProductSchema);
