import express from "express";
import morgan from "morgan";
import authRoute from "./router/auth.route.js";
import friendRoute from "./router/Friend.route.js";
import backgroundRoute from "./router/background.route.js";
import directMessage from "./router/chat/directMessage.route.js"
import userSettingRoute from "./router/usersetting/usersetting.router.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
app.use(morgan("dev"));
// app.disable("etag");
app.use(express.json());
app.use(cookieParser());

// app.use(
//   cors({
//     origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
//     credentials: true,
//   }),
// );
// A. Strict CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"]
}));

// B. Origin/Referer Check Middleware for State-Changing Routes
const verifyCsrfOrigin = (req, res, next) => {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    const origin = req.get('origin') || req.get('referer');
    const allowedOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
    
    if (!origin || !origin.startsWith(allowedOrigin)) {
      return res.status(403).json({ error: "CSRF check failed: Invalid Origin/Referer" });
    }
  }
  next();
};


app.set("trust proxy", 1);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/friends", friendRoute);
app.use("/api/v1/background", backgroundRoute);
app.use("/api/v1/chat/directMessage", directMessage);
app.use("/api/v1/usersetting", userSettingRoute);
app.get("/", (req, res) => {
  res.send("Hello, World!");
});
app.post("/csrf-test", (req, res) => {
  res.json({
    success: true,
    message: "Request reached the server",
  });
});
export default app;
