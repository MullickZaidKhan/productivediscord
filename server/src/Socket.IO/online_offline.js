const onlineUsers = new Map(); // userId -> Set<socketId>
const socketUsers = new Map(); // socketId -> userId

export function addUserSocket(userId, socketId) {

    console.log("🔥 addUserSocket called");
    // console.log("👤 User ID:", userId);
    // console.log("🔌 Socket ID:", socketId);

    if (!onlineUsers.has(userId)) {
      console.log("🆕 User is not currently online. Creating new Set.");

      onlineUsers.set(userId, new Set());
    }

    onlineUsers.get(userId).add(socketId);

    // console.log("✅ Socket added");

    // console.log(
    //   "📌 User's sockets:",
    //   Array.from(onlineUsers.get(userId)).map((socketId) => ({
    //     userId,
    //     socketId,
    //   })),
    // );

    console.log(
      "🟢 Online users:",
      Array.from(onlineUsers.entries()).flatMap(([userId, socketIds]) =>
        Array.from(socketIds).map((socketId) => ({
          userId,
          socketId,
        })),
      ),
    );
    return true;
 
}
export function removeConnection(userId, socketId) {
  console.log("🔥 removeConnection called");
  console.log("👤 User ID:", userId);
  console.log("🔌 Socket ID:", socketId);

  const sockets = onlineUsers.get(userId);

  // User doesn't exist
  if (!sockets) {
    console.log("⚠️ User not found in onlineUsers");
    return false;
  }

  // Remove this specific socket
  sockets.delete(socketId);

  console.log("🗑️ Socket removed:", socketId);

  // User has no more active sockets
  if (sockets.size === 0) {
    onlineUsers.delete(userId);

    console.log("🔴 User is completely offline:", userId);
  } else {
    console.log("🟢 User still has another socket connected");

    console.log(
      "📌 User's sockets:",
      Array.from(sockets).map((socketId) => ({
        userId,
        socketId,
      })),
    );
  }

  // Show ALL currently connected sockets
  console.log(
    "🟢 Online users:",
    Array.from(onlineUsers.entries()).flatMap(([userId, socketIds]) =>
      Array.from(socketIds).map((socketId) => ({
        userId,
        socketId,
      })),
    ),
  );

  // true = user went completely offline
  // false = user still has another connection
  return sockets.size === 0;
}

export function isOnline(userId) {
  const sockets = onlineUsers.get(userId);
  return sockets !== undefined && sockets.size > 0;
}