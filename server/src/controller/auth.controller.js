import { User } from "../model/auth.model.js";
import { Session } from "../model/session.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookies from "cookie-parser";
// import {uploadToImageKit } from "../config/imgkit/image.service.js"

// import imagekit from "../config/imgkit/imagekit.js"
// import { toFile } from "@imagekit/nodejs";

import { uploadToImageKit } from "../config/imgkit/image.service.js";
import config from "../config/config.js";
import {
  signAccessToken,
  signRefreshToken,
  hashToken,
  verifyRefreshToken,
} from "../lib/jwt.js";
import { clearAuthCookies, setAuthCookies } from "../lib/cookies.js";
import upload from "../config/multer.js";

export const register = async (req, res) => {
  const { username, name, email, password } = req.body;

  try {
    // * check all field
    if (!username || !email || !name || !password) {
      return res.status(400).json({
        success: false,
        message: "all Field is required",
      });
    }
    let UPLOADEDPROFILEIMG = "";
    // * check user exist or not
    const existUser = await User.findOne({
      email,
    });
    console.log("Email:", email);
    console.log("Exist User:", existUser);

    // User already exists
    if (existUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const hashPass = await bcrypt.hash(password, 10);
    console.log(
      "Key prefix:",
      config.IMAGEKIT_PRIVATE_KEY?.slice(0, 8),
      "length:",
      config.IMAGEKIT_PRIVATE_KEY?.length,
    );
    // ✅ Upload avatar if exists
    // if (req.file) {
    //   console.log("working")
    //   console.log(req.file)
    //   // const fileToUpload = await toFile(req.file.buffer, req.file.originalname, {
    //   //   type: req.file.mimetype,
    //   //   lastModified: Date.now(),
    //   // });
    //   // const uploadedImage = await imagekit.files.upload({
    //   //   file: fileToUpload,
    //   //   fileName: `${Date.now()}-${req.file.originalname}`,
    //   //   folder: "/avatarsTelegramClone",
    //   // });
    //   // UPLOADEDPROFILEIMG = uploadedImage.url;
    //   // console.log("ImageKit response:", UPLOADEDPROFILEIMG);
    //   console.log(req.file.buffer, req.file.originalname)
    //   const uploadedUrl  = await uploadToImageKit(req.file.buffer, req.file.fieldname);
    //   console.log(uploadedUrl)
    UPLOADEDPROFILEIMG =
      "https://ik.imagekit.io/w5wx4gdmoj/discord_products/Frame%206.png";
    // }
    // * creating new user
    const user = await User.create({
      username,
      email,
      name,
      password: hashPass,
      profileimg: UPLOADEDPROFILEIMG,
    });

    const payload = {
      id: user._id,
      username: user.username,
      name: user.name,
      email: user.email,
      profileimg: user.profileimg,
    };
    // refreshToken generated
    const refreshToken = signRefreshToken(payload);

    const session = await Session.create({
      userId: user._id,
      refreshToken: hashToken(refreshToken),
      verify: true,
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    // * accessToken generated
    const accessToken = signAccessToken(payload);

    setAuthCookies(res, accessToken, refreshToken);

    res.status(201).json({
      success: true,
      message: "User register successfully",
      payload,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "all Field is required",
      });
    }

    // * check user exist or not
    const existUser = await User.findOne({
      email,
    }).select("+password");

    // * if user not exists
    // User not found
    if (!existUser) {
      return res.status(404).json({
        success: false,
        message: "Account not found. Please sign up.",
      });
    }
    console.log(existUser);
    const isRightPassword = await bcrypt.compare(password, existUser.password);

    if (!isRightPassword) {
      return res.status(401).json({
        success: false,
        message: "Wrong Credentials",
      });
    }

    const payload = {
      id: existUser._id,
      username: existUser.username,
      name: existUser.name,
      email: existUser.email,
      profileimg: existUser.profileimg,
    };

    const refreshToken = signRefreshToken(payload);

    await Session.deleteOne({ userId: existUser._id });

    const session = await Session.create({
      userId: existUser._id,
      refreshToken: hashToken(refreshToken),
      verify: true,
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    // * accessToken generated
    const accessToken = signAccessToken(payload);

    setAuthCookies(res, accessToken, refreshToken);

    return res.status(200).json({
      success: true,
      message: "User Logged In",
      payloadtofrontend: payload,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

export const logout = async (req, res) => {
  await Session.deleteOne({ userId: req.user.id });
  clearAuthCookies(res);

  return res.status(200).json({
    success: true,
    message: "Logged Out Successfully.",
  });
};

export const refresh = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized User",
      });
    }

    const isCorrectToken = await Session.findOne({
      refreshToken: hashToken(token),
    });

    if (!isCorrectToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const payload = verifyRefreshToken(token);

    if (!payload) {
      return res.status(401).json({
        success: false,
        message: "Token Expired",
      });
    }

    const existUser = await User.findById(payload.id);

    if (!existUser) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // refreshToken generated
    const newRefreshToken = signRefreshToken(payload);
    const newAccessToken = signAccessToken(payload);

    await Session.findOneAndUpdate(
      { userId: existUser._id },
      {
        refreshToken: hashToken(newRefreshToken),
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        verify: true,
      },
    );

    setAuthCookies(res, newAccessToken, newRefreshToken);

    return res.status(200).json({
      success: true,
      message: "Refreshed.",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

// GET /api/auth/check-username/:username
// Returns { available: boolean, message: string }
export const checkUsername = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username.length) {
      return res.status(400).json({
        success: false,
      });
    }

    if (username.length <= 5) {
      return res.status(400).json({
        message:
          "Username must contain at least 5 and no more than 18 characters",
        success: false,
      });
    }

    if (username.length > 18) {
      return res.status(400).json({
        message:
          "Username must contain at least 5 and no more than 18 characters",
        success: false,
      });
    }

    // Only allow letters, numbers, dots and underscores (Instagram-style)
    const validPattern = /^[a-zA-Z0-9._]+$/;
    if (!validPattern.test(username)) {
      return res.status(200).json({
        available: false,
        message: "Only letters, numbers, '.' and '_' are allowed",
      });
    }

    const existingUser = await User.findOne({
      username: { $regex: `^${username}$`, $options: "i" },
    }).select("_id");

    if (existingUser) {
      return res.status(400).json({
        message: "This username has already been taken",
        success: false,
      });
    }

    return res.status(200).json({
      available: true,
      message: "Username is available",
    });
  } catch (error) {
    console.error("checkUsername error:", error);
    return res.status(500).json({
      available: false,
      message: "Something went wrong while checking username",
    });
  }
};

export const savePublicKey = async (req, res) => {
  try {
    const { publicKey } = req.body;

    if (!publicKey) {
      return res.status(400).json({
        message: "Public key is required",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { publicKey },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Public key saved successfully",
    });
  } catch (error) {
    console.error("Save Public Key Error:", error);

    return res.status(500).json({
      message: "Failed to save public key",
    });
  }
};

export const getPublicKey = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("publicKey");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!user.publicKey) {
      return res.status(404).json({
        message: "Public key not found",
      });
    }

    return res.status(200).json({
      publicKey: user.publicKey,
    });
  } catch (error) {
    console.error("Get Public Key Error:", error);

    return res.status(500).json({
      message: "Failed to get public key",
    });
  }
};