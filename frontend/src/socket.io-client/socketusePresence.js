import { useEffect, useState } from "react";
import { createSocket } from "./socket.io-client";
import { useSelector, useDispatch } from 'react-redux'
import {setonlineuser} from "../redux/onlineFriends/onlineFriends"
export const Socket_usePresence = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    const socket = createSocket();

    socket.connect();

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });
    socket.on("presence:init", (friends) => {
      console.log("🟢 Online friends:", friends);
     dispatch(setonlineuser(friends))
    });
  }, [dispatch]);
  return () => {
    socket.off("connect");
    socket.off("connect_error");
    socket.off("disconnect");
    socket.disconnect();
  };
};
