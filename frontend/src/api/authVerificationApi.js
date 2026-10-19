import { api } from "../api/axios";

// Send verification OTP  -> body: { email }
export const sendVerificationOtp = (body) =>
  api.post("auth/send-verification", body);

// Verify email using OTP -> body: { email, otp }
export const verifyEmailOtp = (body) =>
  api.post("auth/verify-email", body);

// Resend verification OTP -> body: { email }
export const resendVerificationOtp = (body) =>
  api.post("auth/resend-verification", body);