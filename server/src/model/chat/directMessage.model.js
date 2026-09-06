import mongoose from "mongoose";

const directMessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    encryptedText: {
      type: String,
      default: null,
    },

    iv: {
      type: String,
      default: null,
    },

    image: {
      type: String,
      default: "",
    },

    seen: {
      type: Boolean,
      default: false,
    },

    deleted: {
      type: Boolean,
      default: false,
    },
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "directMessage",
      default: null,
    },
    edited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export const directMessage = mongoose.model(
  "directMessage",
  directMessageSchema,
);
