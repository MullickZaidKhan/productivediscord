import { addUserSocket, removeConnection, isOnline } from "./online_offline.js";
import { sendTypingEvent } from "./chat/mainsocket.js";
import { User } from "../model/auth.model.js";

export function adduserinSocket(io) {
  io.on("connection", async (socket) => {
    const userId = socket.data.userId;

    console.log("🔥 SOCKET CONNECTED");
    console.log("👤 User ID:", userId);
    console.log("🔌 Socket ID:", socket.id);

    // Add user to online users
    addUserSocket(userId, socket.id);

    // Send updated presence to this user
    await sendPresence(io, userId);
        // ------------------------------------
    // TYPING START
    // ------------------------------------

    socket.on("typing:start", async ({ senderId, receiverId }) => {
      console.log("⌨️ TYPING START RECEIVED");
      console.log("Sender:", senderId);
      console.log("Receiver:", receiverId);

      await sendTypingEvent(
        senderId,
        receiverId,
        "typing:start"
      );
    });

    // ------------------------------------
    // TYPING STOP
    // ------------------------------------

    socket.on("typing:stop", async ({ senderId, receiverId }) => {
      console.log("⌨️ TYPING STOP RECEIVED");
      console.log("Sender:", senderId);
      console.log("Receiver:", receiverId);

      await sendTypingEvent(
        senderId,
        receiverId,
        "typing:stop"
      );
    });
    // Get this user's friends
    const user = await User.findById(userId).select("friends").lean();

    const friends = user?.friends || [];

    // 🔥 Tell all online friends that this user is now online
    for (const friendId of friends) {
      if (isOnline(friendId.toString())) {
        await sendPresence(io, friendId.toString());
      }
    }
    // When user disconnects
    socket.on("disconnect", async () => {
      const wentOffline = removeConnection(userId, socket.id);

      console.log("🔴 SOCKET DISCONNECTED:", socket.id);

      // User is completely offline
      if (wentOffline) {
        const user = await User.findById(userId).select("friends").lean();

        const friends = user?.friends || [];

        // Update all online friends
        for (const friendId of friends) {
          if (isOnline(friendId.toString())) {
            await sendPresence(io, friendId.toString());
          }
        }
      }
    });
  });
}

// ------------------------------------
// SEND ONLINE FRIENDS TO ONE USER
// ------------------------------------

async function sendPresence(io, userId) {
  const user = await User.findById(userId).select("friends").lean();

  const friends = user?.friends || [];

  // Find which friends are online
  const onlineFriends = friends.filter((friendId) =>
    isOnline(friendId.toString()),
  );

  // Get their information
  const onlineFriendsWithName = await User.find({
    _id: { $in: onlineFriends },
  })
    .select("_id name profileimg")
    .lean();

  const data = onlineFriendsWithName.map((friend) => ({
    id: friend._id.toString(),
    name: friend.name,
    profileimg: friend.profileimg,
  }));

  // Find sockets belonging to this user
  for (const socket of io.sockets.sockets.values()) {
    if (String(socket.data.userId) === String(userId)) {
      socket.emit("presence:init", data);
    }
  }
}
