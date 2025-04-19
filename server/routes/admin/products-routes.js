import express from "express";
import {
  addProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
  handleImageUpload,
} from "../../controllers/admin/products-controller.js";
import { upload } from "../../helpers/cloundinary.js";
import { admin, protect } from "../../middleware/auth.js";

const router = express.Router();

router.post("/upload-image", upload.single("my_file"), handleImageUpload);
router.post("/add", protect, admin, addProduct);
router.put("/edit/:id", protect, admin, editProduct);
router.delete("/delete/:id", protect, admin, deleteProduct);
router.get("/get", protect, fetchAllProducts);

export default router;
