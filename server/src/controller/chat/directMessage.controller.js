// import { User } from "../../model/auth.model.js";
// import { directMessage } from "../../model/chat/directMessage.model.js";
// import { mainchat } from "../../Socket.IO/chat/mainsocket.js";
// import { getIO } from "../../Socket.IO/socket.js";

// export const SenddirectMessage = async (req, res) => {
//   const io = getIO();
//   try {
//     // const { receiver, encryptedText, iv, replyTo } = req.body;
//     const { receiver, encryptedText, iv, replyTo, deviceId } = req.body;
//     console.log(req.body);
//     // Validation
//     if (!receiver) {
//       return res.status(400).json({ message: "Receiver is required" });
//     }
//     if (!encryptedText && !req.file) {
//       return res.status(400).json({ message: "Message cannot be empty" });
//     }
//     const userId = req.user.id;
//     // Upload image (if any)
//     let image = "";
//     if (req.file) {
//       const imageUrl = await uploadToImageKit(
//         req.file.buffer,
//         req.file.originalname,
//       );

//       image = imageUrl;
//     }
//     // 1️⃣ Create message
//     const directMessageinchat = await directMessage.create({
//       sender: userId,
//       receiver,
//       encryptedText,
//       iv,
//       deviceId,
//       image,
//       replyTo: replyTo || null,
//       edited: false,
//       editedAt: null,
//     });
//     mainchat(io, receiver, directMessageinchat);
//     // 4️⃣ Send response immediately
//     res.status(201).json({
//       message: "Message sent successfully",
//       data: directMessageinchat,
//     });
//   } catch (error) {
//     console.error("Send Message Error:", error);

//     return res.status(500).json({
//       message: "Internal server error",
//     });
//   }
// };
// /**
//  * =========================
//  * GET CHAT BETWEEN TWO USERS
//  * =========================
//  */
// /**
//  * Retrieve paginated chat messages between the authenticated user and
//  * a specific conversation partner.
//  */
// export const getdirectMessage = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const loginuserId = req.user.id;

//     if (!userId) {
//       return res.status(400).json({ message: "userId is required" });
//     }
//     const query = {
//       deleted: false,
//       $or: [
//         { sender: loginuserId, receiver: userId },
//         { sender: userId, receiver: loginuserId },
//       ],
//     };

//     const [directmessageschat, totaldirectmessageschat] = await Promise.all([
//       directMessage
//         .find(query)

//         .select(
//           "_id sender receiver encryptedText iv text image seen createdAt replyTo editedAt edited deviceId",
//         )
//         .populate({
//           path: "replyTo",
//           select: "_id text image sender createdAt",
//         }),

//       directMessage.countDocuments(query),
//     ]);

//     const orderedMessages = directmessageschat.reverse();
//     return res.status(200).json({
//       message: "Messages fetched successfully",
//       data: orderedMessages,
//     });
//   } catch (error) {
//     console.error("Get Messages Error:", error);

//     return res.status(500).json({
//       message: "Internal server error",
//     });
//   }
// };
import { directMessage } from "../../model/chat/directMessage.model.js";
import { mainchat } from "../../Socket.IO/chat/mainsocket.js";
import { getIO } from "../../Socket.IO/socket.js";
// import { uploadToImageKit } from "..."; // keep your existing import


// ======================================================
// SEND DIRECT MESSAGE
// ======================================================

export const SenddirectMessage = async (req, res) => {
  const io = getIO();

  try {
    const {
      receiver,

      // Device from which message was sent
      senderDeviceId,

      // Receiver device encrypted copies
      deviceMessagesreceiver,

      // Sender's other device encrypted copies
      deviceMessagessender,

      replyTo,
    } = req.body;

    console.log("📩 Request body:", req.body);

    // ==================================================
    // CURRENT USER
    // ==================================================

    const userId = req.user.id;

    // ==================================================
    // VALIDATION
    // ==================================================

    if (!receiver) {
      return res.status(400).json({
        message: "Receiver is required",
      });
    }

    if (!senderDeviceId) {
      return res.status(400).json({
        message: "senderDeviceId is required",
      });
    }

    // ==================================================
    // VALIDATE RECEIVER DEVICE COPIES
    // ==================================================

    if (Array.isArray(deviceMessagesreceiver)) {
      for (const deviceMessage of deviceMessagesreceiver) {
        if (!deviceMessage.senderDeviceId) {
          return res.status(400).json({
            message: "senderDeviceId is required in receiver device copy",
          });
        }

        if (!deviceMessage.receiverDeviceId) {
          return res.status(400).json({
            message: "receiverDeviceId is required",
          });
        }

        if (!deviceMessage.encryptedText) {
          return res.status(400).json({
            message: "encryptedText is required",
          });
        }

        if (!deviceMessage.iv) {
          return res.status(400).json({
            message: "iv is required",
          });
        }
      }
    }

    // ==================================================
    // VALIDATE SENDER DEVICE COPIES
    // ==================================================

    if (Array.isArray(deviceMessagessender)) {
      for (const deviceMessage of deviceMessagessender) {
        if (!deviceMessage.senderDeviceId) {
          return res.status(400).json({
            message: "senderDeviceId is required in sender device copy",
          });
        }

        if (!deviceMessage.encryptedText) {
          return res.status(400).json({
            message: "encryptedText is required",
          });
        }

        if (!deviceMessage.iv) {
          return res.status(400).json({
            message: "iv is required",
          });
        }
      }
    }

    // ==================================================
    // CHECK MESSAGE EXISTS
    // ==================================================

    if (
      !req.file &&
      (!Array.isArray(deviceMessagesreceiver) ||
        deviceMessagesreceiver.length === 0) &&
      (!Array.isArray(deviceMessagessender) ||
        deviceMessagessender.length === 0)
    ) {
      return res.status(400).json({
        message: "Message cannot be empty",
      });
    }

    // ==================================================
    // IMAGE
    // ==================================================

    let image = "";

    if (req.file) {
      const imageUrl = await uploadToImageKit(
        req.file.buffer,
        req.file.originalname,
      );

      image = imageUrl;
    }

    // ==================================================
    // DEBUG BEFORE SAVE
    // ==================================================

    console.log("🔐 Sender device:", senderDeviceId);

    console.log(
      "🔐 Receiver copies:",
      JSON.stringify(deviceMessagesreceiver, null, 2),
    );

    console.log(
      "🔐 Sender copies:",
      JSON.stringify(deviceMessagessender, null, 2),
    );

    // ==================================================
    // CREATE MESSAGE
    // ==================================================

    const directMessageinchat = await directMessage.create({
      sender: userId,

      receiver,

      // Device from which the message originated
      senderDeviceId,

      // Receiver's devices
      deviceMessagesreceiver: deviceMessagesreceiver || [],

      // Sender's other devices
      deviceMessagessender: deviceMessagessender || [],

      image,

      replyTo: replyTo || null,

      edited: false,

      editedAt: null,
    });

    // ==================================================
    // DEBUG AFTER SAVE
    // ==================================================

    console.log(
      "✅ Message created:",
      directMessageinchat._id,
    );

    console.log(
      "📱 Receiver copies:",
      directMessageinchat.deviceMessagesreceiver?.length || 0,
    );

    console.log(
      "💻 Sender copies:",
      directMessageinchat.deviceMessagessender?.length || 0,
    );

    // ==================================================
    // SOCKET
    // ==================================================

    mainchat(
      io,
      receiver,
      directMessageinchat,
    );

    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(201).json({
      message: "Message sent successfully",

      data: directMessageinchat,
    });
  } catch (error) {
    console.error(
      "❌ Send Message Error:",
      error,
    );

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


// ======================================================
// GET DIRECT MESSAGES
// ======================================================

export const getdirectMessage = async (req, res) => {
  try {
    const { userId } = req.params;

    const loginuserId = req.user.id;

    // ==================================================
    // VALIDATION
    // ==================================================

    if (!userId) {
      return res.status(400).json({
        message: "userId is required",
      });
    }

    // ==================================================
    // QUERY
    // ==================================================

    const query = {
      deleted: false,

      $or: [
        {
          sender: loginuserId,
          receiver: userId,
        },

        {
          sender: userId,
          receiver: loginuserId,
        },
      ],
    };

    // ==================================================
    // GET MESSAGES
    // ==================================================

    const [
      directmessageschat,
      totaldirectmessageschat,
    ] = await Promise.all([
      directMessage
        .find(query)
        .select(`
          _id
          sender
          receiver
          senderDeviceId
          deviceMessagesreceiver
          deviceMessagessender
          image
          seen
          createdAt
          replyTo
          editedAt
          edited
        `)
        .populate({
          path: "replyTo",
          select: `
            _id
            sender
            receiver
            senderDeviceId
            deviceMessagesreceiver
            deviceMessagessender
            image
            createdAt
          `,
        }),

      directMessage.countDocuments(query),
    ]);

    // ==================================================
    // ORDER
    // ==================================================

    const orderedMessages = directmessageschat.reverse();

    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(200).json({
      message: "Messages fetched successfully",

      data: orderedMessages,

      total: totaldirectmessageschat,
    });
  } catch (error) {
    console.error(
      "❌ Get Messages Error:",
      error,
    );

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};