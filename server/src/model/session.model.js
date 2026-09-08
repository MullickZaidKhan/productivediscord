// import mongoose from 'mongoose'

// const sessionSchema = new mongoose.Schema({
//     refreshToken: {
//         type: String,
//         required: [true, "Refresh Token is required."]
//     },
//     userId : {
//         type: mongoose.Schema.ObjectId,
//         ref : "User",
//         required : true   },
//     verify: {
//         type: Boolean,
//         required: true,
//         default: false,
//     },
//     expiryDate: {
//         type: Date,
//         required: true,
//     }
// }, {timestamps: true})

// export const Session = mongoose.model("Session", sessionSchema)

import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    refreshToken: {
      type: String,
      required: [true, "Refresh Token is required."],
    },

    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },

    // Identifies this browser/device
    deviceId: {
      type: String,
      required: [true, "Device ID is required."],
    },

    verify: {
      type: Boolean,
      required: true,
      default: false,
    },

    expiryDate: {
      type: Date,
      required: true,
    },

    // Device information
    browser: {
      type: String,
      default: "Unknown",
    },

    os: {
      type: String,
      default: "Unknown",
    },

    ipAddress: {
      type: String,
      default: null,
    },

    userAgent: {
      type: String,
      default: null,
    },

    // Last time this device/session was active
    lastActiveAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate sessions for the same
// user + device
sessionSchema.index(
  { userId: 1, deviceId: 1 },
  { unique: true }
);

export const Session = mongoose.model("Session", sessionSchema);