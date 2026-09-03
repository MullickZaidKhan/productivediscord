import { Socket } from "socket.io";
import {getIO} from "../socket.js"
import { getonlineUsers } from "../online_offline.js";
async function mainchat(io,sendId, Messageinchat) {
  const getallsockit = getonlineUsers(sendId);
  if (!getallsockit || getallsockit.size === 0) {
    console.log("🔴 Receiver is offline");
    return;
  }
  for (const SocketID of getallsockit) {
    io.to(SocketID).emit( "message:receive",
      { message: Messageinchat,
      senderId: Messageinchat.sender,});
  }
}
// Send typing event to receiver
async function sendTypingEvent(senderId, receiverId, event) {
  const io = getIO();

  const receiverSockets = getonlineUsers(receiverId);

  if (!receiverSockets || receiverSockets.size === 0) {
    console.log("🔴 Typing receiver is offline");
    return;
  }

  for (const socketId of receiverSockets) {
    io.to(socketId).emit(event, {
      userId: senderId,
    });

    console.log("📤 TYPING EVENT SENT:", event);
    console.log("📤 TO SOCKET:", socketId);
  }
}

export { mainchat,sendTypingEvent };
