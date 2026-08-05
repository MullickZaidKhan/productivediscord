import express from "express";
import morgan from "morgan";
import authRoute from "./router/auth.route.js";
import friendRoute from "./router/Friend.route.js";
import backgroundRoute from "./router/background.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
app.use(morgan("dev"));
// app.disable("etag");
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
);

app.set("trust proxy", 1);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/friends", friendRoute);
app.use("/api/v1/background", backgroundRoute);
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

export default app;
