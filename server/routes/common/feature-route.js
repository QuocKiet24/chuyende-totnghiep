import express from "express";
import {
  addFeatureImage,
  deleteFeatureImage,
  getFeatureImages,
} from "../../controllers/common/feature-controller.js";
import { admin, protect } from "../../middleware/auth.js";

const router = express.Router();

router.post("/add", protect, admin, addFeatureImage);
router.get("/get", getFeatureImages);
router.delete("/delete/:id", deleteFeatureImage);

export default router;
