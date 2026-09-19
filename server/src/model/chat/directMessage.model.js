// import mongoose from "mongoose";

// const directMessageSchema = new mongoose.Schema(
//   {
//     sender: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     receiver: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     encryptedText: {
//       type: String,
//       default: null,
//     },

//     iv: {
//       type: String,
//       default: null,
//     },
//       deviceId: {
//     type: String,
//     required: true,
//   },
//     image: {
//       type: String,
//       default: "",
//     },

//     seen: {
//       type: Boolean,
//       default: false,
//     },

//     deleted: {
//       type: Boolean,
//       default: false,
//     },
//     replyTo: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "directMessage",
//       default: null,
//     },
//     edited: {
//       type: Boolean,
//       default: false,
//     },
//     editedAt: {
//       type: Date,
//       default: null,
//     },
//   },
//   {
//     timestamps: true,
//   },
// );

// export const directMessage = mongoose.model(
//   "directMessage",
//   directMessageSchema,
// );
import mongoose from "mongoose";

const directMessageSchema = new mongoose.Schema(
  {
    // User who sent the message
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // User who receives the message
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Copies encrypted for receiver's devices
    deviceMessagesreceiver: {
      type: [
        {
          receiverDeviceId: {
            type: String,
            required: true,
          },

          encryptedText: {
            type: String,
            required: true,
          },

          iv: {
            type: String,
            required: true,
          },
        },
      ],

      required: true,

      validate: {
        validator: function (value) {
          return value.length > 0;
        },
        message: "At least one receiver device message is required",
      },
    },

    // Copies encrypted for sender's other devices
    deviceMessagessender: {
      type: [
        {
          senderDeviceId: {
            type: String,
            required: true,
          },
          encryptedText: {
            type: String,
            required: true,
          },
          iv: {
            type: String,
            required: true,
          },
        },
      ],
      required: true,
      validate: {
        validator: function (value) {
          return value.length > 0;
        },
        message: "At least one sender device message is required",
      },
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
