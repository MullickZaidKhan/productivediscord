
import express from "express";

import {
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  changePassword,
} from "../../controller/usersetting/password/password.controller.js";

import { verifyJwt } from "../../middleware/auth.middleware.js";

const router = express.Router();

// Forgot Password
router.post("/forgot-password", forgotPassword);

// Verify OTP
router.post("/verify-reset-otp", verifyResetOTP);

// Reset Password
router.post("/reset-password", resetPassword);

// Change Password (Login required)
router.patch("/change-password", verifyJwt, changePassword);

export default router;
