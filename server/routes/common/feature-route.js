import express from "express";
import {
  addFeatureImage,
  getFeatureImages,
} from "../../controllers/common/feature-controller.js";
import { admin, protect } from "../../middleware/auth.js";

const router = express.Router();

router.post("/add", protect, admin, addFeatureImage);
router.get("/get", getFeatureImages);

export default router;
