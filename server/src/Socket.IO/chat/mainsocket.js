import { Socket } from "socket.io";
import { getonlineUsers } from "../online_offline.js";
async function mainchat(io,sendId, Messageinchat) {
  const getallsockit = getonlineUsers(sendId);
  if (!getallsockit || getallsockit.size === 0) {
    console.log("🔴 Receiver is offline");
    return;
  }
  for (const SocketID of getallsockit) {
    io.to(SocketID).emit( "message:receive",
      Messageinchat);
  }
}

export { mainchat };
