import { verifyAccessToken } from "../lib/jwt.js";
import { User } from "../model/auth.model.js";

export const verifyJwt = async function (req, res, next) {
  try {
    // console.log(req.cookies);
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user.",
      });
    }

    const payload = verifyAccessToken(token);
    const userId = payload.id || payload._id;
    req.user = { id: userId };

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "internal server error",
    });
  }
};

export const accessTokenverifyJwt = async function (req, res) {
  try {
    // console.log(req.cookies);
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user.",
      });
    }

    const payload = verifyAccessToken(token);
    const userId = payload.id || payload._id;

    const existUser = await User.findById(userId).select(
      "username name email profileimg"
    );

    if (!existUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const responsePayload = {
      id: existUser._id,
      username: existUser.username,
      name: existUser.name,
      email: existUser.email,
      profileimg: existUser.profileimg,
    };

    res.status(200).json({
      success: true,
      payloadtofrontend: responsePayload,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "internal server error",
    });
  }
};