import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      unique: true,
      maxlength: [50, "Username cannot exceed 50 characters"],
    },

    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
      index: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false,
    },
    publicKey: {
      type: String,
      default: null,
    },
    profileimg: {
      type: String,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    // ---- Email verification / OTP tracking ----

    // Hashed OTP (plain OTP is never stored). A new OTP overwrites this.
    emailVerificationOtpHash: {
      type: String,
      default: null,
    },

    // When the current OTP expires (1 minute after generation).
    emailVerificationOtpExpires: {
      type: Date,
      default: null,
    },

    // Number of FAILED verification attempts (reset after lockout ends).
    emailVerificationAttempts: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Timestamp of the last OTP generation.
    emailVerificationLastSentAt: {
      type: Date,
      default: null,
    },

    // Total number of OTPs generated for this user.
    emailVerificationOtpGeneratedCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // OTP generation is blocked until this time after the generation limit
    // is exceeded (count is reset to 0 once this time has passed).
    emailVerificationOtpBlockedUntil: {
      type: Date,
      default: null,
    },

    // Verification is blocked until this time after too many failed attempts.
    emailVerificationLockedUntil: {
      type: Date,
      default: null,
    },

    // Friends List
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const User = mongoose.model("User", userSchema);