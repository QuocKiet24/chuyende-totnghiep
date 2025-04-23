import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    image: String,
    title: {
      "vi-VN": { type: String, required: true },
      "en-US": { type: String, required: true },
    },
    description: {
      "vi-VN": { type: String, required: true },
      "en-US": { type: String, required: true },
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
    averageReview: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Product", ProductSchema);
