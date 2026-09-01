// import { addUserSocket, removeConnection, isOnline } from "./online_offline.js";
// import { User } from "../model/auth.model.js";

// export function adduserinSocket(io) {
//   io.on("connection", async (socket) => {
//     const userId = socket.data.userId;

//     console.log("🔥 SOCKET CONNECTED");
//     console.log("👤 User ID:", userId);
//     console.log("🔌 Socket ID:", socket.id);

//     // Add user
//     addUserSocket(userId, socket.id);

//     // Get user's friends
//     const user = await User.findById(userId).select("friends").lean();

//     // console.log("👤 USER:", user);

//     const friends = user?.friends || [];

//     // console.log("👥 FRIEND IDS:", friends);

//     // Find online friends
//     const onlineFriends = friends.filter((friendId) =>
//       isOnline(friendId.toString()),
//     );

//     console.log("🟢 ONLINE FRIENDS: \n \n", onlineFriends);
//     // Get names of online friends
//     const onlineFriendsWithName = await User.find({
//       _id: { $in: onlineFriends },
//     })
//       .select("_id name profileimg")
//       .lean();

//     console.log("👥 ONLINE FRIENDS WITH NAME:", onlineFriendsWithName);

//     // Send to client
//     socket.emit(
//       "presence:init",
//       onlineFriendsWithName.map((friend) => ({
//         id: friend._id.toString(),
//         name: friend.name,
//         profileimg: friend.profileimg,
//       })),
//     );

//     socket.on("disconnect", () => {
//       const wentOffline = removeConnection(userId, socket.id);

//       console.log("🔴 SOCKET DISCONNECTED:", socket.id);
//     });
//   });
// }

// async function sendPresence(io, userId) {
//   const user = await User.findById(userId)
//     .select("friends")
//     .lean();

//   const friends = user?.friends || [];

//   const onlineFriends = friends.filter((friendId) =>
//     isOnline(friendId.toString())
//   );

//   const onlineFriendsWithName = await User.find({
//     _id: { $in: onlineFriends },
//   })
//     .select("_id name profileimg")
//     .lean();

//   const data = onlineFriendsWithName.map((friend) => ({
//     id: friend._id.toString(),
//     name: friend.name,
//     profileimg: friend.profileimg,
//   }));

//   // Get this user's socket ID
//   const userSocketId = getUserSocket(userId);

//   if (userSocketId) {
//     io.to(userSocketId).emit("presence:init", data);
//   }
// }

import { addUserSocket, removeConnection, isOnline } from "./online_offline.js";

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

    // Get this user's friends
    const user = await User.findById(userId).select("friends").lean();

    const friends = user?.friends || [];

    // 🔥 Tell all online friends that this user is now online
    for (const friendId of friends) {
      if (isOnline(friendId.toString())) {
        await sendPresence(io, friendId.toString());
      }
    }

//     ```js
// // When user disconnects
// socket.on("disconnect", async () => {
//   console.log("🔴 SOCKET DISCONNECTED:", socket.id);
//   console.log("👤 User ID:", userId);

//   const wentOffline = removeConnection(userId, socket.id);

//   console.log("🚦 Completely offline:", wentOffline);
//   console.log("🟢 ONLINE USERS AFTER DISCONNECT:", getOnlineUsers());

//   // Only notify friends when this was the user's LAST socket
//   if (wentOffline) {
//     const user = await User.findById(userId)
//       .select("friends")
//       .lean();

//     const friends = user?.friends || [];

//     // Tell every ONLINE friend that this user went offline
//     for (const friendId of friends) {
//       if (isOnline(friendId.toString())) {
//         await sendPresence(io, friendId.toString());
//       }
//     }
//   }
// });
// ```;

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
