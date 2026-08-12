import express from "express";
import {
      getAllBackgrounds,
  getUserBackground,
  setUserBackground,
  setprofileimg,
} from "../controller/background.controller.js";
import {
  verifyJwt,
  accessTokenverifyJwt,
} from "../middleware/auth.middleware.js";
import upload from '../config/multer.js'
const router = express.Router();
// Public - Get all backgrounds (used on signup page)
router.get("/all", getAllBackgrounds);
// Get logged-in user's selected background
router.get("/user-background", verifyJwt, getUserBackground);

// Set logged-in user's background

router.put("/user-background", verifyJwt, setUserBackground);

//setprofile img
router.put("/set-profileimg", verifyJwt,  upload.single("profileimg"),setprofileimg);
export default router;
