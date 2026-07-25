import { User } from "../model/auth.model.js";
import { Session } from "../model/session.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookies from "cookie-parser";
import config from "../config/config.js"; // Aapki config file
import { signAccessToken, signRefreshToken, hashToken, verifyRefreshToken } from "../lib/jwt.js";
import { clearAuthCookies, setAuthCookies } from "../lib/cookies.js";

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // * check all field
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "all Field is required",
      });
    }

    // * check user exist or not
    const existUser = await User.findOne({
      email,
    });

    // * if user exists
    if (existUser) {
      return res.status(409).json({
        success: false,
        message: "something went wrong",
      });
    }

    const hashPass = await bcrypt.hash(password, 10);

    // * creating new user
    const user = await User.create({
      username,
      email,
      password: hashPass,
    });

    const payload = {
      id: user._id,
      name: user.username,
      email: user.email,
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
    if (!existUser) {
      return res.status(400).json({
        success: false,
        message: "Something went wrong",
      });
    }

    const isRightPassword = await bcrypt.compare(password, existUser.password);

    if (!isRightPassword) {
      return res.status(401).json({
        success: false,
        message: "Wrong Credentials",
      });
    }

    const payload = {
      id: existUser._id,
      name: existUser.username,
      email: existUser.email,
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
      }
    );

    setAuthCookies(res, newAccessToken, newRefreshToken);

    return res.status(200).json({
      success: true,
      message: "Refreshed."
    })
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
const checkUsername = async (req, res) => {
  try {
    const { username } = req.params;
    if(!username){
       return res.status(400).json({
        success:false
       })
    }

    if(username<5){
       return res.status(400).json({
        message: "Username must be at least 5 characters",
        success:false,
       })
    }

    if(username>18){
       return res.status(400).json({
        message: "Username cannot exceed 18 characters",
        success:false,
       })
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

    if(existingUser){
       return res.status(400).json({
        message: "This username has already been taken",
        success:false,
       })
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
}