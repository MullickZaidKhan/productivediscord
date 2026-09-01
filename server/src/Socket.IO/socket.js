// src/Socket.IO/socket.js

let io = null;

// Store the Socket.IO instance
export const setIO = (socketIO) => {
  io = socketIO;
};

// Get the Socket.IO instance anywhere in your backend
export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized");
  }

  return io;
};