import mongoose from "mongoose";

const userBackgroundSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    background: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Background",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const UserBackground = mongoose.model(
  "UserBackground",
  userBackgroundSchema
);