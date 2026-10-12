import { Router } from "express";
import {
  register,
  login,
  logout,
  refresh,
  checkUsername,
  savePublicKey,
  getPublicKeys,
  getAllLoginDevices,
} from "../controller/auth.controller.js";
import {
  verifyJwt,
  accessTokenverifyJwt,
} from "../middleware/auth.middleware.js";

import {
  sendVerificationOtp,
  verifyEmailOtp,
  resendVerificationOtp,
} from "../controller/Secure/verifyEmail.controller.js";

import upload from "../config/multer.js";
const authRoute = Router();

//All the post
authRoute.post("/register", upload.single("profileimg"), register);
authRoute.post("/login", login);
authRoute.post("/logout", verifyJwt, logout);
authRoute.post("/public-key", verifyJwt, savePublicKey);
authRoute.get( "/login-devices", verifyJwt, getAllLoginDevices );
authRoute.get("/public-key/:userId", verifyJwt, getPublicKeys);
//All the get
authRoute.get("/refresh", refresh);
authRoute.get("/accesstoken", accessTokenverifyJwt);
authRoute.get("/checkUsername/:username", checkUsername);
// Send verification OTP
authRoute.post("/send-verification", sendVerificationOtp);

// Verify email using OTP
authRoute.post("/verify-email", verifyEmailOtp);

// Resend verification OTP
authRoute.post("/resend-verification", resendVerificationOtp);
//export
export default authRoute;
