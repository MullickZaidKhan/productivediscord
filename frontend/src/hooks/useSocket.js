import { useContext } from "react";
import { SocketContext } from "../context/socket.context.js";

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
}

export function usePresence() {
  const { onlineFriendIds, isFriendOnline, isConnected } = useSocket();
  return { onlineFriendIds, isFriendOnline, isConnected };
}
