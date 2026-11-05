import { User } from "../../model/auth.model.js";

export const updateUserName = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    const trimmedName = name.trim();

    if (trimmedName.length > 50) {
      return res.status(400).json({
        success: false,
        message: "Name cannot exceed 50 characters",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name: trimmedName },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Name updated successfully",
      data: { name: updatedUser.name },
    });
  } catch (error) {
    console.error("Update name error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
