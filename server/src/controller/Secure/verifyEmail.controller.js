import { User } from "../../model/auth.model.js";

import {
  generateOtp,
  hashOtp,
  sendVerificationEmail,
} from "../../utils/emailVerification.js";

const OTP_EXPIRY_MS = 60 * 1000; // 1 minute
const OTP_COOLDOWN_MS = 30 * 1000; // 30 seconds between OTP requests
const MAX_OTP_ATTEMPTS = 5; // max failed verification attempts
const LOCKOUT_MS = 30 * 60 * 1000; // 30 minutes
const MAX_OTP_GENERATIONS = 5; // OTPs allowed before generation is blocked
const OTP_GENERATION_BLOCK_MS = 30 * 60 * 1000; // 30 minutes

const normalizeEmail = (email) =>
  typeof email === "string" ? email.trim().toLowerCase() : "";

const toMs = (date) => (date ? new Date(date).getTime() : 0);

const secondsLeft = (untilMs, nowMs) =>
  Math.max(1, Math.ceil((untilMs - nowMs) / 1000));

// If a lockout has ended, clear it and reset the failed-attempt counter.
// Returns true if the user document was modified.
const clearExpiredLockout = (user, now) => {
  const lockedUntil = toMs(user.emailVerificationLockedUntil);

  if (lockedUntil && lockedUntil <= now) {
    user.emailVerificationLockedUntil = null;
    user.emailVerificationAttempts = 0;
    return true;
  }
  return false;
};

// If the OTP-generation block has ended, clear it and reset the generation
// count to 0. Returns true if the user document was modified.
const clearExpiredGenerationBlock = (user, now) => {
  const blockedUntil = toMs(user.emailVerificationOtpBlockedUntil);

  if (blockedUntil && blockedUntil <= now) {
    user.emailVerificationOtpBlockedUntil = null;
    user.emailVerificationOtpGeneratedCount = 0;
    return true;
  }
  return false;
};

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

    // Lockout handling: a new OTP is pointless while verification is blocked.
    let wasCleared = clearExpiredLockout(user, now);
    wasCleared = clearExpiredGenerationBlock(user, now) || wasCleared;

    const lockedUntil = toMs(user.emailVerificationLockedUntil);

    if (lockedUntil > now) {
      if (wasCleared) await user.save();

      const retryAfterSeconds = secondsLeft(lockedUntil, now);
      res.set("Retry-After", String(retryAfterSeconds));

      return res.status(429).json({
        success: false,
        message:
          "Too many failed attempts. Please try again after the lockout period.",
        retryAfterSeconds,
      });
    }

    // OTP generation block (generation limit previously exceeded).
    const otpBlockedUntil = toMs(user.emailVerificationOtpBlockedUntil);

    if (otpBlockedUntil > now) {
      if (wasCleared) await user.save();

      const retryAfterSeconds = secondsLeft(otpBlockedUntil, now);
      res.set("Retry-After", String(retryAfterSeconds));

      return res.status(429).json({
        success: false,
        message:
          "Too many verification codes requested. Please try again later.",
        retryAfterSeconds,
      });
    }

    // Resend cooldown (30 seconds since the last OTP generation).
    const lastSent = toMs(user.emailVerificationLastSentAt);

    if (lastSent > 0 && now - lastSent < OTP_COOLDOWN_MS) {
      if (wasCleared) await user.save();

      const retryAfterSeconds = secondsLeft(lastSent + OTP_COOLDOWN_MS, now);
      res.set("Retry-After", String(retryAfterSeconds));

      return res.status(429).json({
        success: false,
        message: "Please wait before requesting another code.",
        retryAfterSeconds,
      });
    }

    // Generation limit: 5 OTPs allowed. The next request would exceed the
    // limit, so block generation for 30 minutes instead.
    if ((user.emailVerificationOtpGeneratedCount ?? 0) >= MAX_OTP_GENERATIONS) {
      user.emailVerificationOtpBlockedUntil = new Date(
        now + OTP_GENERATION_BLOCK_MS
      );

      await user.save();

      const retryAfterSeconds = Math.ceil(OTP_GENERATION_BLOCK_MS / 1000);
      res.set("Retry-After", String(retryAfterSeconds));

      return res.status(429).json({
        success: false,
        message:
          "Too many verification codes requested. Please try again in 30 minutes.",
        retryAfterSeconds,
      });
    }

    // Remember previous values so we can roll back if email delivery fails.
    const previousLastSentAt = user.emailVerificationLastSentAt;

    const otp = generateOtp();

    // New OTP replaces any previous one and restarts the expiry timer.
    // Note: failed-attempt count is NOT reset here, otherwise requesting
    // new OTPs would bypass the attempt limit.
    user.emailVerificationOtpHash = hashOtp(otp);
    user.emailVerificationOtpExpires = new Date(now + OTP_EXPIRY_MS);
    user.emailVerificationLastSentAt = new Date(now);
    user.emailVerificationOtpGeneratedCount =
      (user.emailVerificationOtpGeneratedCount ?? 0) + 1;

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

      // Roll back: the user never received this OTP.
      user.emailVerificationOtpHash = null;
      user.emailVerificationOtpExpires = null;
      user.emailVerificationLastSentAt = previousLastSentAt;
      user.emailVerificationOtpGeneratedCount = Math.max(
        0,
        (user.emailVerificationOtpGeneratedCount ?? 1) - 1
      );

      await user.save();

      return res.status(503).json({
        success: false,
        message: "Email delivery failed. Please try again shortly.",
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

    const now = Date.now();

    // 1. Lockout check (also resets counter once the lockout has ended).
    const wasCleared = clearExpiredLockout(user, now);
    const lockedUntil = toMs(user.emailVerificationLockedUntil);

    if (lockedUntil > now) {
      const retryAfterSeconds = secondsLeft(lockedUntil, now);
      res.set("Retry-After", String(retryAfterSeconds));

      return res.status(429).json({
        success: false,
        message:
          "Too many failed attempts. Please try again after the lockout period.",
        retryAfterSeconds,
      });
    }

    if (wasCleared) await user.save();

    // 2. OTP existence / expiry check (does not count as a failed attempt).
    const expiresAt = toMs(user.emailVerificationOtpExpires);

    if (!user.emailVerificationOtpHash || expiresAt <= now) {
      return res.status(400).json({
        success: false,
        message: "Code expired. Please request a new one.",
      });
    }

    // 3. Compare OTP.
    if (hashOtp(otp) !== user.emailVerificationOtpHash) {
      user.emailVerificationAttempts =
        (user.emailVerificationAttempts ?? 0) + 1;

      if (user.emailVerificationAttempts >= MAX_OTP_ATTEMPTS) {
        // Lock verification for 30 minutes and invalidate the current OTP.
        user.emailVerificationLockedUntil = new Date(now + LOCKOUT_MS);
        user.emailVerificationOtpHash = null;
        user.emailVerificationOtpExpires = null;

        await user.save();

        const retryAfterSeconds = Math.ceil(LOCKOUT_MS / 1000);
        res.set("Retry-After", String(retryAfterSeconds));

        return res.status(429).json({
          success: false,
          message:
            "Too many failed attempts. Verification is locked for 30 minutes.",
          retryAfterSeconds,
        });
      }

      await user.save();

      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code.",
        attemptsRemaining: MAX_OTP_ATTEMPTS - user.emailVerificationAttempts,
      });
    }

    // 4. Successful verification.
    user.isEmailVerified = true;
    user.emailVerificationOtpHash = null;
    user.emailVerificationOtpExpires = null;
    user.emailVerificationAttempts = 0;
    user.emailVerificationLockedUntil = null;
    // emailVerificationLastSentAt and emailVerificationOtpGeneratedCount are
    // kept intentionally for tracking.

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