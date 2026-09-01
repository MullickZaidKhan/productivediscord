// import { io } from "socket.io-client";

// let socket = null;

// export function createSocket() {
//   if (socket) {
//     socket.disconnect();
//   }

//   socket = io(import.meta.env.VITE_BACKEND_URL, {
//     withCredentials: true,
//     autoConnect: false,
//   });

//   return socket;
// }

// export function getSocket() {
//   return socket;
// }

// export function disconnectSocket() {
//   if (socket) {
//     socket.disconnect();
//     socket = null;
//   }
// }
import { io } from "socket.io-client";

let socket = null;

export function createSocket() {

  if (socket) {
    return socket;
  }

  socket = io(import.meta.env.VITE_BACKEND_URL, {
    withCredentials: true,
    autoConnect: false,
  });

  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}