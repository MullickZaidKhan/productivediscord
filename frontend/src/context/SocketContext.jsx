import { useEffect, useState, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { createSocket } from "../socket.io-client/socket.io-client.js";
import { SocketContext } from "./socket.context.js";

export function SocketProvider({ children }) {
  const userinfo = useSelector((state) => state.authinfoSlice.userinfo);
  const [onlineFriendIds, setOnlineFriendIds] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!userinfo?.id) return;

    const s = createSocket();
    socketRef.current = s;

    s.on("connect", () => {
      console.log("Socket connected:", s.id);
      setIsConnected(true);
    });

    s.on("presence:friends", ({ onlineFriendIds: ids }) => {
      console.log("Presence snapshot:", ids);
      setOnlineFriendIds(ids);
    });

    s.on("friend:online", ({ userId }) => {
      console.log("Friend came online:", userId);
      setOnlineFriendIds((prev) => {
        if (prev.includes(userId)) return prev;
        return [...prev, userId];
      });
    });

    s.on("friend:offline", ({ userId }) => {
      console.log("Friend went offline:", userId);
      setOnlineFriendIds((prev) => prev.filter((id) => id !== userId));
    });

    s.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      setIsConnected(false);
      if (reason === "io server disconnect") {
        s.connect();
      }
    });

    s.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
      if (
        error.message === "Invalid or expired token" ||
        error.message === "Authentication required"
      ) {
        import("../api/Auth.api.js")
          .then(({ refreshtoken }) => {
            refreshtoken()
              .then(() => {
                s.connect();
              })
              .catch(() => {
                console.error("Token refresh failed, cannot reconnect socket");
              });
          });
      }
    });

    s.connect();

    return () => {
      s.off("connect");
      s.off("presence:friends");
      s.off("friend:online");
      s.off("friend:offline");
      s.off("disconnect");
      s.off("connect_error");
      s.disconnect();
      socketRef.current = null;
      setIsConnected(false);
      setOnlineFriendIds([]);
    };
  }, [userinfo?.id]);

  const isFriendOnline = useCallback(
    (friendId) => onlineFriendIds.includes(friendId),
    [onlineFriendIds]
  );

  const value = {
    socket: socketRef,
    onlineFriendIds,
    isConnected,
    isFriendOnline,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}
