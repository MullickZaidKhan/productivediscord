
import { User } from "../../model/auth.model.js";

import {
  generateOtp,
  hashOtp,
  sendVerificationEmail,
} from "../../utils/emailVerification.js";

const OTP_COOLDOWN_MS =
  process.env.NODE_ENV === "production" ? 60_000 : 10_000;

const OTP_EXPIRY_MS = 10 * 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;

const normalizeEmail = (email) =>
  typeof email === "string" ? email.trim().toLowerCase() : "";


// POST /api/v1/auth/send-verification
export const sendVerificationOtp = async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const user = await User.findOne({ email });

    // Avoid revealing whether an account exists.
    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If the account is eligible, a verification code will be sent.",
      });
    }

    if (user.isEmailVerified) {
      return res.status(200).json({
        success: true,
        message: "Email is already verified.",
      });
    }

    const now = Date.now();

    const lastSent = user.emailVerificationLastSentAt
      ? new Date(user.emailVerificationLastSentAt).getTime()
      : 0;

    const hasActiveOtp =
      Boolean(user.emailVerificationOtpHash) &&
      Boolean(user.emailVerificationOtpExpires) &&
      new Date(user.emailVerificationOtpExpires).getTime() > now;

    // Enforce cooldown for an active OTP.
    if (
      hasActiveOtp &&
      Number.isFinite(lastSent) &&
      lastSent > 0 &&
      now - lastSent < OTP_COOLDOWN_MS
    ) {
      const retryAfterSeconds = Math.ceil(
        (OTP_COOLDOWN_MS - (now - lastSent)) / 1000
      );

      res.set("Retry-After", String(retryAfterSeconds));

      return res.status(429).json({
        success: false,
        message: "Please wait before requesting another code.",
        retryAfterSeconds,
      });
    }

    const otp = generateOtp();

    // Store the hashed OTP, never the plain OTP.
    user.emailVerificationOtpHash = hashOtp(otp);
    user.emailVerificationOtpExpires = new Date(
      now + OTP_EXPIRY_MS
    );
    user.emailVerificationAttempts = 0;
    user.emailVerificationLastSentAt = new Date(now);

    await user.save();

    try {
      await sendVerificationEmail(user.email, otp);
    } catch (emailError) {
      console.error("[EMAIL OTP] Delivery failed:", {
        message: emailError.message,
        code: emailError.code,
        command: emailError.command,
        responseCode: emailError.responseCode,
        response: emailError.response,
      });

      // Clear OTP and cooldown after failed delivery.
      user.emailVerificationOtpHash = null;
      user.emailVerificationOtpExpires = null;
      user.emailVerificationAttempts = 0;
      user.emailVerificationLastSentAt = null;

      await user.save();

      return res.status(503).json({
        success: false,
        message:
          "Email delivery failed. Please try again shortly.",
      });
    }

    console.log("[EMAIL OTP] Verification email sent.", {
      email: user.email,
    });

    return res.status(200).json({
      success: true,
      message: "Verification code sent to your email.",
    });
  } catch (error) {
    console.error("[EMAIL OTP] Controller failed:", {
      message: error.message,
      name: error.name,
      code: error.code,
    });

    return res.status(500).json({
      success: false,
      message: "Unable to send verification code.",
    });
  }
};


// POST /api/v1/auth/verify-email
export const verifyEmailOtp = async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const otp = String(req.body?.otp ?? "").trim();

    if (!email || !/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: "Enter your email and a valid 6-digit code.",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code.",
      });
    }

    if (user.isEmailVerified) {
      return res.status(200).json({
        success: true,
        message: "Email is already verified.",
      });
    }

    const expiresAt = user.emailVerificationOtpExpires
      ? new Date(user.emailVerificationOtpExpires).getTime()
      : 0;

    if (
      !user.emailVerificationOtpHash ||
      !Number.isFinite(expiresAt) ||
      expiresAt <= Date.now()
    ) {
      return res.status(400).json({
        success: false,
        message: "Code expired. Please request a new one.",
      });
    }

    if (
      (user.emailVerificationAttempts ?? 0) >= MAX_OTP_ATTEMPTS
    ) {
      return res.status(429).json({
        success: false,
        message: "Too many attempts. Please request a new code.",
      });
    }

    const suppliedHash = hashOtp(otp);

    // Count every verification attempt.
    user.emailVerificationAttempts =
      (user.emailVerificationAttempts ?? 0) + 1;

    if (suppliedHash !== user.emailVerificationOtpHash) {
      // Invalidate the OTP after the fifth incorrect attempt.
      if (
        user.emailVerificationAttempts >= MAX_OTP_ATTEMPTS
      ) {
        user.emailVerificationOtpHash = null;
        user.emailVerificationOtpExpires = null;
      }

      await user.save();

      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code.",
      });
    }

    // Successful verification.
    user.isEmailVerified = true;
    user.emailVerificationOtpHash = null;
    user.emailVerificationOtpExpires = null;
    user.emailVerificationAttempts = 0;
    user.emailVerificationLastSentAt = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully.",
    });
  } catch (error) {
    console.error("[EMAIL OTP] Verification failed:", {
      message: error.message,
      name: error.name,
      code: error.code,
    });

    return res.status(500).json({
      success: false,
      message: "Unable to verify email right now.",
    });
  }
};


// POST /api/v1/auth/resend-verification
export const resendVerificationOtp = async (req, res) => {
  return sendVerificationOtp(req, res);
};

