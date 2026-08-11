import { Router } from "express";
import {
  register,
  login,
  logout,
  refresh,
  checkUsername,
} from "../controller/auth.controller.js";
import {
  verifyJwt,
  accessTokenverifyJwt,
} from "../middleware/auth.middleware.js";
import upload from '../config/multer.js'
const authRoute = Router();

//All the post
authRoute.post("/register",upload.single('profileimg'), register);
authRoute.post("/login", login);
authRoute.post("/logout", verifyJwt, logout);

//All the get
authRoute.get("/refresh", refresh);
authRoute.get("/accesstoken", accessTokenverifyJwt);
authRoute.get("/checkUsername/:username",checkUsername);

//export
export default authRoute;
