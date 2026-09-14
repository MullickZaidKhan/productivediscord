import mongoose from "mongoose";

const userDeviceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },

    deviceId: {
      type: String,
      required: true,
    },

    publicKey: {
      type: String,
      required: true,
    },

    browser: {
      type: String,
      default: "Unknown",
    },

    os: {
      type: String,
      default: "Unknown",
    },

    lastActiveAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

userDeviceSchema.index(
  { userId: 1, deviceId: 1 },
  { unique: true }
);

export const UserDevice = mongoose.model(
  "UserDevice",
  userDeviceSchema
);