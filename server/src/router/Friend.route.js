import express from "express";
const friendRoute = express.Router();

import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendRequests,
  getFriends,
  removeFriend,
  getPendingFriendRequests,
  getSentFriendRequests,
} from "../controller/Friend.controller.js";

import {
  verifyJwt,
  accessTokenverifyJwt,
} from "../middleware/auth.middleware.js";

friendRoute.post("/request", verifyJwt, sendFriendRequest);

friendRoute.patch("/accept/:requestId", verifyJwt, acceptFriendRequest);

friendRoute.patch("/reject/:requestId", verifyJwt, rejectFriendRequest);

friendRoute.get("/requests", verifyJwt, getFriendRequests);

friendRoute.get("/sent", verifyJwt, getSentFriendRequests);

friendRoute.get("/", verifyJwt, getFriends);

friendRoute.delete("/:friendId", verifyJwt, removeFriend);

friendRoute.get("/pending", verifyJwt, getPendingFriendRequests);

export default friendRoute;
