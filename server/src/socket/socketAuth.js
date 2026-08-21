// import { verifyAccessToken } from "../lib/jwt.js";

// function parseCookies(cookieHeader) {
//   const cookies = {};
//   if (!cookieHeader) return cookies;
//   cookieHeader.split(";").forEach((pair) => {
//     const [key, ...rest] = pair.split("=");
//     cookies[key.trim()] = rest.join("=").trim();
//   });
//   return cookies;
// }

// export function socketAuthMiddleware(socket, next) {
//   try {
//     const cookieHeader = socket.handshake.headers.cookie;
//     const cookies = parseCookies(cookieHeader);
//     const token = cookies.accessToken;

//     if (!token) {
//       return next(new Error("Authentication required"));
//     }

//     const payload = verifyAccessToken(token);
//     socket.data.userId = payload.id || payload._id;
//     next();
//   } catch (error) {
//     next(new Error("Invalid or expired token"));
//   }
// }
