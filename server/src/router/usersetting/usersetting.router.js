import { Router } from "express";
import { updateUserName } from "../../controller/usersetting/usersetting.controller.js";
import { verifyJwt } from "../../middleware/auth.middleware.js";

const router = Router();

router.put("/update-name", verifyJwt, updateUserName);

export default router;
