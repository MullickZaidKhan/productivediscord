import { User } from "../../model/auth.model.js";
import { directMessage } from "../../model/chat/directMessage.model.js";

export const SenddirectMessage = async (req, res) => {
  try {
    const { receiver, text, replyTo } = req.body;
    console.log(req.body);
    // Validation
    if (!receiver) {
      return res.status(400).json({ message: "Receiver is required" });
    }
    const trimmedText = text?.trim() || "";
    if (!trimmedText && !req.file) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }
    const userId = req.user.id;
    // Upload image (if any)
    let image = "";
    if (req.file) {
      const imageUrl = await uploadToImageKit(
        req.file.buffer,
        req.file.originalname,
      );

      image = imageUrl;
    }
    // 1️⃣ Create message
    const directMessageinchat = await directMessage.create({
      sender: userId,
      receiver,
      text: trimmedText,
      image,
      replyTo: replyTo || null,
      edited: false,
      editedAt: null,
    });
    // 4️⃣ Send response immediately
    res.status(201).json({
      message: "Message sent successfully",
      data: directMessageinchat,
    });
  } catch (error) {
    console.error("Send Message Error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
/**
 * =========================
 * GET CHAT BETWEEN TWO USERS
 * =========================
 */
/**
 * Retrieve paginated chat messages between the authenticated user and
 * a specific conversation partner.
 */
export const getdirectMessage = async (req, res) => {
  try {
    const { userId } = req.params;
    const loginuserId = req.user.id;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    const query = {
      deleted: false,
      $or: [
        { sender: loginuserId, receiver: userId },
        { sender: userId, receiver: loginuserId },
      ],
    };

    const [directmessageschat, totaldirectmessageschat] = await Promise.all([
      directMessage
        .find(query)

        .select(
          "_id sender receiver text image seen createdAt replyTo editedAt edited",
        )
        .populate({
          path: "replyTo",
          select: "_id text image sender createdAt",
        }),

      directMessage.countDocuments(query),
    ]);

    const orderedMessages = directmessageschat.reverse();
    return res.status(200).json({
      message: "Messages fetched successfully",
      data: orderedMessages,
    });
  } catch (error) {
    console.error("Get Messages Error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
