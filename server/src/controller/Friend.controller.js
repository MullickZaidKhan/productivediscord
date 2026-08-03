import mongoose from "mongoose";
import { User } from "../model/auth.model.js";
import { FriendRequest } from "../model/friendRequest.model.js";

export const sendFriendRequest = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId } = req.body; // username or ObjectId

    if (!receiverId) {
      return res.status(400).json({
        success: false,
        message: "Username is required.",
      });
    }

    // Find sender
    const sender = await User.findById(senderId);

    if (!sender) {
      return res.status(404).json({
        success: false,
        message: "Sender not found.",
      });
    }

    // Find receiver by username or ObjectId
    let receiver = null;

    if (mongoose.Types.ObjectId.isValid(receiverId)) {
      receiver = await User.findById(receiverId);
    }

    if (!receiver) {
      receiver = await User.findOne({
        username: { $regex: `^${receiverId}$`, $options: "i" },
      });
    }

    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Can't send request to yourself
    if (sender._id.toString() === receiver._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot send a friend request to yourself.",
      });
    }

    // Already friends
    const isFriend = sender.friends.some(
      (friendId) => friendId.toString() === receiver._id.toString()
    );

    if (isFriend) {
      return res.status(400).json({
        success: false,
        message: "You are already friends.",
      });
    }

    // Check if request already exists (either direction)
    const existingRequest = await FriendRequest.findOne({
      $or: [
        {
          sender: sender._id,
          receiver: receiver._id,
          status: "pending",
        },
        {
          sender: receiver._id,
          receiver: sender._id,
          status: "pending",
        },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "Friend request already exists.",
      });
    }

    await FriendRequest.create({
      sender: sender._id,
      receiver: receiver._id,
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      message: "Friend request sent successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const receiverId = req.user.id;
    const { requestId } = req.params;

    const request = await FriendRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found.",
      });
    }

    if (request.receiver.toString() !== receiverId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    request.status = "accepted";
    await request.save();

    await User.findByIdAndUpdate(request.sender, {
      $addToSet: {
        friends: request.receiver,
      },
    });

    await User.findByIdAndUpdate(request.receiver, {
      $addToSet: {
        friends: request.sender,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Friend request accepted.",
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const rejectFriendRequest = async (req, res) => {
  try {
    const receiverId = req.user.id;
    const { requestId } = req.params;

    const request = await FriendRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found.",
      });
    }

    if (request.receiver.toString() !== receiverId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    request.status = "rejected";

    await request.save();

    return res.status(200).json({
      success: true,
      message: "Friend request rejected.",
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getFriendRequests = async (req, res) => {
  try {
    const requests = await FriendRequest.find({
      receiver: req.user.id,
      status: "pending",
    }).populate("sender", "username name email");

    return res.status(200).json({
      success: true,      count: requests.length,
      payload: requests,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getSentFriendRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const requests = await FriendRequest.find({
      sender: userId,
      status: "pending",
    })
      .populate("receiver", "username name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,      payload: requests,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "friends",
      "username name email",
    );

    return res.status(200).json({
      success: true,
      payload: user.friends,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const removeFriend = async (req, res) => {
  try {
    const myId = req.user.id;
    const { friendId } = req.params;

    await User.findByIdAndUpdate(myId, {
      $pull: {
        friends: friendId,
      },
    });

    await User.findByIdAndUpdate(friendId, {
      $pull: {
        friends: myId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Friend removed.",
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Get all pending friend requests for logged in user
export const getPendingFriendRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const requests = await FriendRequest.find({
      receiver: userId,
      status: "pending",
    })
      .populate("sender", "username name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      payload: requests,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};