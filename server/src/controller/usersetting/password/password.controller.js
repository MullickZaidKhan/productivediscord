
import { User } from "../../../model/auth.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendPasswordResetEmail } from "../../../utils/emailVerification.js";

// Helpers
const hashValue = (value) =>
  crypto.createHash("sha256").update(value).digest("hex");

const generateOTP = () =>
  crypto.randomInt(100000, 1000000).toString();

const generateResetToken = () =>
  crypto.randomBytes(32).toString("hex");

const normalizeEmail = (email) =>
  String(email || "").trim().toLowerCase();

const OTP_EXPIRY = 60 * 1000;
const OTP_COOLDOWN = 30 * 1000;
const MAX_OTP_ATTEMPTS = 5;
const LOCKOUT_DURATION = 30 * 60 * 1000;
const RESET_TOKEN_EXPIRY = 10 * 60 * 1000;

// 1. FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email }).select(
      "+resetOtpLastSentAt +resetOtpLockedUntil"
    );

    // Don't reveal whether the email exists.
    const genericMessage =
      "If an account exists with this email, password reset instructions will be sent.";

    if (!user) {
      return res.status(200).json({
        success: true,
        message: genericMessage,
      });
    }

    const now = Date.now();

    if (
      user.resetOtpLockedUntil &&
      user.resetOtpLockedUntil.getTime() > now
    ) {
      return res.status(200).json({
        success: true,
        message: genericMessage,
      });
    }

    if (
      user.resetOtpLastSentAt &&
      now - user.resetOtpLastSentAt.getTime() < OTP_COOLDOWN
    ) {
      return res.status(429).json({
        success: false,
        message: "Please wait before requesting another OTP.",
      });
    }

    const otp = generateOTP();

    user.resetOtpHash = hashValue(otp);
    user.resetOtpExpiresAt = new Date(now + OTP_EXPIRY);
    user.resetOtpLastSentAt = new Date(now);
    user.resetOtpAttempts = 0;
    user.resetOtpLockedUntil = null;

    // Clear any previous reset authorization.
    user.resetTokenHash = undefined;
    user.resetTokenExpiresAt = undefined;

    await user.save();

    try {
      await sendPasswordResetEmail(user.email, otp);
    } catch (emailError) {
      // Don't leave an unusable OTP active.
      user.resetOtpHash = undefined;
      user.resetOtpExpiresAt = undefined;
      user.resetOtpLastSentAt = undefined;
      await user.save();

      throw emailError;
    }

    return res.status(200).json({
      success: true,
      message: genericMessage,
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to process password reset request.",
    });
  }
};


// 2. VERIFY RESET OTP
export const verifyResetOTP = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const otp = String(req.body.otp || "").trim();

    if (!email || !/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: "Valid email and 6-digit OTP are required.",
      });
    }

    const user = await User.findOne({ email }).select(
      "+resetOtpHash +resetOtpExpiresAt +resetOtpAttempts +resetOtpLockedUntil"
    );

    if (!user || !user.resetOtpHash) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP.",
      });
    }

    const now = Date.now();

    if (
      user.resetOtpLockedUntil &&
      user.resetOtpLockedUntil.getTime() > now
    ) {
      return res.status(429).json({
        success: false,
        message: "Too many attempts. Try again later.",
      });
    }

    if (
      !user.resetOtpExpiresAt ||
      user.resetOtpExpiresAt.getTime() <= now
    ) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Request a new OTP.",
      });
    }

    const isValid =
      hashValue(otp) === user.resetOtpHash;

    if (!isValid) {
      user.resetOtpAttempts = (user.resetOtpAttempts || 0) + 1;

      if (user.resetOtpAttempts >= MAX_OTP_ATTEMPTS) {
        user.resetOtpLockedUntil =
          new Date(now + LOCKOUT_DURATION);

        user.resetOtpHash = undefined;
        user.resetOtpExpiresAt = undefined;
      }

      await user.save();

      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    // OTP is single-use.
    const resetToken = generateResetToken();

    user.resetTokenHash = hashValue(resetToken);
    user.resetTokenExpiresAt =
      new Date(now + RESET_TOKEN_EXPIRY);

    user.resetOtpHash = undefined;
    user.resetOtpExpiresAt = undefined;
    user.resetOtpAttempts = 0;
    user.resetOtpLastSentAt = undefined;
    user.resetOtpLockedUntil = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully.",
      resetToken,
    });

  } catch (error) {
    console.error("Verify reset OTP error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to verify OTP.",
    });
  }
};


// 3. RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword, confirmPassword } = req.body;

    if (!resetToken || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    if (
      typeof newPassword !== "string" ||
      newPassword.length < 8 ||
      newPassword.length > 72
    ) {
      return res.status(400).json({
        success: false,
        message: "Password must be between 8 and 72 characters.",
      });
    }

    const tokenHash = hashValue(resetToken);

    const user = await User.findOne({
      resetTokenHash: tokenHash,
      resetTokenExpiresAt: { $gt: new Date() },
    }).select("+resetTokenHash +resetTokenExpiresAt");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset session.",
      });
    }

    user.password = await bcrypt.hash(newPassword, 12);

    // Consume reset authorization.
    user.resetTokenHash = undefined;
    user.resetTokenExpiresAt = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully. Please log in again.",
    });

  } catch (error) {
    console.error("Reset password error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to reset password.",
    });
  }
};


// 4. CHANGE PASSWORD (LOGGED-IN USER)
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    if (
      typeof newPassword !== "string" ||
      newPassword.length < 8 ||
      newPassword.length > 72
    ) {
      return res.status(400).json({
        success: false,
        message: "Password must be between 8 and 72 characters.",
      });
    }

    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const user = await User.findById(userId).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    const isSamePassword = await bcrypt.compare(
      newPassword,
      user.password
    );

    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different.",
      });
    }

    user.password = await bcrypt.hash(newPassword, 12);

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });

  } catch (error) {
    console.error("Change password error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to change password.",
    });
  }
};
