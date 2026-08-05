import express from "express";
import {
      getAllBackgrounds,
  getUserBackground,
  setUserBackground,
} from "../controller/background.controller.js";
import {
  verifyJwt,
  accessTokenverifyJwt,
} from "../middleware/auth.middleware.js";
const router = express.Router();
// Public - Get all backgrounds (used on signup page)
router.get("/all", getAllBackgrounds);
// Get logged-in user's selected background
router.get("/user-background", verifyJwt, getUserBackground);

// Set logged-in user's background

router.put("/user-background", verifyJwt, setUserBackground);

export default router;
