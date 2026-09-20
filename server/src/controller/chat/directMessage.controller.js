
import { directMessage } from "../../model/chat/directMessage.model.js";
import { mainchat } from "../../Socket.IO/chat/mainsocket.js";
import { getIO } from "../../Socket.IO/socket.js";
import mongoose from "mongoose";
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



// ======================================================
// GET PEOPLE I HAVE TALKED TO
// ======================================================

export const getTalkedUsers = async (req, res) => {
  try {
    const loginuserId = req.user.id;

    const talkedUsers = await directMessage.aggregate([
      // ==================================================
      // 1. Messages where current user participated
      // ==================================================

      {
        $match: {
          deleted: false,

          $or: [
            {
              sender: new mongoose.Types.ObjectId(loginuserId),
            },
            {
              receiver: new mongoose.Types.ObjectId(loginuserId),
            },
          ],
        },
      },

      // ==================================================
      // 2. Latest message first
      // ==================================================

      {
        $sort: {
          createdAt: -1,
        },
      },

      // ==================================================
      // 3. Find the other user
      // ==================================================

      {
        $addFields: {
          otherUser: {
            $cond: [
              {
                $eq: [
                  "$sender",
                  new mongoose.Types.ObjectId(loginuserId),
                ],
              },
              "$receiver",
              "$sender",
            ],
          },
        },
      },

      // ==================================================
      // 4. One entry per user
      // ==================================================

      {
        $group: {
          _id: "$otherUser",
        },
      },

      // ==================================================
      // 5. Get user information
      // ==================================================

      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },

      {
        $unwind: "$user",
      },

      // ==================================================
      // 6. Return ONLY user information
      // ==================================================

      {
        $project: {
          _id: "$user._id",
          email: "$user.email",
          name: "$user.name",
          profileimg: "$user.profileimg",
          username: "$user.username",
        },
      },
    ]);

    return res.status(200).json({
      message: "Talked users fetched successfully",
      data: talkedUsers,
      total: talkedUsers.length,
    });
  } catch (error) {
    console.error("❌ Get Talked Users Error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

