import express from "express";
import upload from "../../config/multer.js";
import {
  verifyJwt,
  accessTokenverifyJwt,
} from "../../middleware/auth.middleware.js";
import {
  SenddirectMessage,
  getdirectMessage,
  getTalkedUsers,
} from "../../controller/chat/directMessage.controller.js";
const router = express.Router();
router.post(
  "/send-directMessage",
  verifyJwt,
  upload.single("image"),
  SenddirectMessage,
);
router.get("/direct-message/:userId", verifyJwt, getdirectMessage);
router.get("/direct-messagechatUsers", verifyJwt, getTalkedUsers);
//export
export default router;
