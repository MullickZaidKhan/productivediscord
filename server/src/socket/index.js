import { User } from "../model/auth.model.js";
import { addConnection, removeConnection, isOnline } from "./presenceManager.js";

export function registerSocket(io) {
  io.on("connection", (socket) => {
    const userId = socket.data.userId;
    console.log("User connected:", userId, "socket:", socket.id);

    socket.join(`user:${userId}`);

    const isFirst = addConnection(userId, socket.id);

    if (isFirst) {
      notifyFriendsOnline(userId, io);
      sendOnlineFriendsSnapshot(userId, socket);
    }

    socket.on("disconnect", (reason) => {
      console.log("User disconnected:", userId, "socket:", socket.id, "reason:", reason);
      const isLast = removeConnection(userId, socket.id);

      if (isLast) {
        notifyFriendsOffline(userId, io);
      }
    });
  });
}

async function notifyFriendsOnline(userId, io) {
  try {
    const user = await User.findById(userId).select("friends").lean();
    if (!user || !user.friends.length) return;

    for (const friendId of user.friends) {
      if (isOnline(friendId)) {
        io.to(`user:${friendId}`).emit("friend:online", { userId });
      }
    }
  } catch (error) {
    console.error("Error notifying friends online:", error);
  }
}

async function notifyFriendsOffline(userId, io) {
  try {
    const user = await User.findById(userId).select("friends").lean();
    if (!user || !user.friends.length) return;

    for (const friendId of user.friends) {
      if (isOnline(friendId)) {
        io.to(`user:${friendId}`).emit("friend:offline", { userId });
      }
    }
  } catch (error) {
    console.error("Error notifying friends offline:", error);
  }
}

async function sendOnlineFriendsSnapshot(userId, socket) {
  try {
    const user = await User.findById(userId).select("friends").lean();
    if (!user || !user.friends.length) {
      socket.emit("presence:friends", { onlineFriendIds: [] });
      return;
    }

    const onlineFriendIds = user.friends.filter((friendId) => isOnline(friendId));
    socket.emit("presence:friends", { onlineFriendIds });
  } catch (error) {
    console.error("Error sending online friends snapshot:", error);
  }
}
