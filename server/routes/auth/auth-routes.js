import express from "express";
import {
  checkAuth,
  login,
  logout,
  register,
  sendOTP,
  verifyEmail,
} from "../../controllers/auth/auth-controller.js";
import { protect } from "../../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.get("/send-otp", protect, sendOTP);
router.get("/check-auth", protect, checkAuth);
router.get("/logout", protect, logout);

export default router;
