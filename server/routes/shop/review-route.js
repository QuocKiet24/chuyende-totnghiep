import express from "express";
import { protect } from "../../middleware/auth.js";
import {
  addProductReview,
  getProductReviews,
} from "../../controllers/shop/product-review-controller.js";

const router = express.Router();

router.post("/add", protect, addProductReview);
router.get("/:productId", getProductReviews);

export default router;
