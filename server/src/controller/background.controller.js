import { User } from "../model/auth.model.js";
import { Background } from "../model/background.model.js";
import { UserBackground } from "../model/userBackground.model.js";
import { uploadToImageKit } from "../config/imgkit/image.service.js";
export const setUserBackground = async (req, res) => {
  try {
    const { backgroundId } = req.body;

    if (!backgroundId) {
      return res.status(400).json({
        success: false,
        message: "Background ID is required",
      });
    }

    const background = await Background.findById(backgroundId);

    if (!background) {
      return res.status(404).json({
        success: false,
        message: "Background not found",
      });
    }

    const userBackground = await UserBackground.findOneAndUpdate(
      { user: req.user.id },
      {
        user: req.user.id,
        background: background._id,
      },
      {
        upsert: true,
        returnDocument: "after",
      },
    ).populate("background");

    return res.status(200).json({
      success: true,
      message: "Background updated successfully",
      data: userBackground.background,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getUserBackground = async (req, res) => {
  try {
    const userBackground = await UserBackground.findOne({
      user: req.user.id,
    }).populate("background");

    if (!userBackground) {
      return res.status(404).json({
        success: false,
        message: "No background found for this user",
      });
    }

    return res.status(200).json({
      success: true,
      data: userBackground.background,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
// Get all available backgrounds
export const getAllBackgrounds = async (req, res) => {
  try {
    const backgrounds = await Background.find().sort({ order: 1 });

    return res.status(200).json({
      success: true,
      count: backgrounds.length,
      data: backgrounds,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//Profile set

export const setprofileimg = async (req, res) => {
  try {
    const userId = req.user.id;

    let profileimg;

    // User uploaded their own image
    if (req.file) {
      const uploadedUrl = await uploadToImageKit(
        req.file.buffer,
        req.file.originalname,
      );

      profileimg = uploadedUrl;
    }

    // User selected an image from your database
    else if (req.body?.profileimg) {
      profileimg = req.body.profileimg;
    }

    // No image provided
    else {
      return res.status(400).json({
        success: false,
        message: "Please upload an image or select a profile image",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profileimg },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    console.log("UPDATED USER:", updatedUser);
    console.log("PROFILE IMAGE:", updatedUser.profileimg);
    const data = {
      id: updatedUser._id,
      name: updatedUser.name,
      username: updatedUser.username,
      email: updatedUser.email,
      profileimg: updatedUser.profileimg,
    };
    // Return only required user fields
    return res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      data: data,
    });
  } catch (error) {
    console.error("Set profile image error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
