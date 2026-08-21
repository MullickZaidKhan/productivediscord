import { addUserSocket, removeConnection,isOnline } from "./online_offline.js";
import { User } from "../model/auth.model.js";
// export function adduserinSocket(io) {
//   io.on("connection", async(socket) => {
//     console.log(socket.id);
//     // console.log("form adduserinSocket User ID:", socket.data.userId, "\n");
//     addUserSocket(socket.data.userId, socket.id);
//            // -------------------------
//         // Get user's friends
//         // -------------------------

//         const user = await User
//             .findById(socket.data.userId)
//             .select("friends")
//             .lean();
//         console.log('user',user)
//         const friends = user?.friends || [];


//         // -------------------------
//         // Find online friends
//         // -------------------------

//         const onlineFriends = friends.filter((friendId) =>
//             isOnline(friendId.toString())
//         );


//         // -------------------------
//         // Send initial presence
//         // -------------------------

//         socket.emit("presence:init", onlineFriends);

//         console.log("🟢 Online friends:", onlineFriends);
//     socket.on("disconnect", () => {
//       removeConnection(socket.data.userId, socket.id);
//       console.log("user disconnected");
//     });
//   });
// }
export function adduserinSocket(io) {

    io.on("connection", async (socket) => {

        const userId = socket.data.userId;

        console.log("🔥 SOCKET CONNECTED");
        console.log("👤 User ID:", userId);
        console.log("🔌 Socket ID:", socket.id);


        // Add user
        addUserSocket(userId, socket.id);


        // Check currently online users
        // console.log(
        //     "🟢 CURRENT ONLINE USERS:",
        //     Array.from(onlineUsers.keys())
        // );


        // Get user's friends
        const user = await User
            .findById(userId)
            .select("friends")
            .lean();

        console.log("👤 USER:", user);


        const friends = user?.friends || [];

        console.log("👥 FRIEND IDS:", friends);


        // Check every friend
        friends.forEach((friendId) => {

            console.log(
                "Friend:",
                friendId.toString(),
                "Online:",
                isOnline(friendId.toString())
            );

        });


        // Find online friends
        const onlineFriends = friends.filter((friendId) =>
            isOnline(friendId.toString())
        );


        console.log(
            "🟢 ONLINE FRIENDS: \n \n",
            onlineFriends
        );


        // Send to client
        socket.emit(
            "presence:init",
            onlineFriends.map((id) => id.toString())
        );


        socket.on("disconnect", () => {

            const wentOffline = removeConnection(
                userId,
                socket.id
            );

            console.log(
                "🔴 SOCKET DISCONNECTED:",
                socket.id
            );

        });

    });

}
async function sendOnlineFriendsSnapshot() {
      io.on("connection", async (socket) => {
        const userId=socket.data.userId;
        const user = await User.findById(userId).select("friends").lean();
        const friends = user?.friends || [];
        const onlineFriends = friends.filter((f) => isOnline(f.toString()));
        socket.emit("presence:init", onlineFriends);
        console.log(onlineFriends)
      })
}