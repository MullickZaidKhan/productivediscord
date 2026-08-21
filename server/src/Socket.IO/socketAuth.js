import { verifyAccessToken } from "../lib/jwt.js";

import { parse } from "cookie";
export function socketAuthMiddleware(socket, next) {
    // console.log("🔥 SOCKET AUTH MIDDLEWARE CALLED");

    try {
        const cookieHeader = socket.handshake.headers.cookie;

        // console.log("🍪 cookieHeader:\n", cookieHeader);
        // console.log("🍪 COOKIE: \n", cookieHeader);

        const cookies = parse(cookieHeader);
        const token = cookies.accessToken;

        // console.log("🔑 TOKEN EXISTS:", !!token);

        if (!token) {
            console.log("❌ NO TOKEN");
            return next(new Error("Authentication required"));
        }

        const payload = verifyAccessToken(token);

        // console.log("\n✅ TOKEN VALID:payload ", payload);

        socket.data.userId = payload.id || payload._id;

        // console.log("👤 USER ID:", socket.data.userId);

        next();
    } catch (error) {
        console.log("❌ SOCKET AUTH ERROR:", error);

        next(new Error("Invalid or expired token"));
    }
}