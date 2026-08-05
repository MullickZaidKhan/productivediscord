import { User } from "../model/auth.model.js";
import { Background } from "../model/background.model.js";
import { UserBackground } from "../model/userBackground.model.js";
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
      }
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