import dotenv from "dotenv";
dotenv.config();
import app from "./src/app.js";
import config from "./src/config/config.js";
import { connectDB } from "./src/config/db.js";
import dns from "dns";
import { Server } from "socket.io";
import { createServer } from "node:http";
import { adduserinSocket } from "./src/Socket.IO/index.js";
import { socketAuthMiddleware } from "./src/Socket.IO/socketAuth.js";

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true,
  },
});

io.use(socketAuthMiddleware);
adduserinSocket(io);
// Use Google DNS
dns.setServers(["8.8.8.8", "8.8.4.4"]);

connectDB(); // Database se connect karne ke liye function call
const PORT = config.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// api/v1/auth//register
