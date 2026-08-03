import mongoose from "mongoose";
import { User } from "../model/auth.model.js";
import { FriendRequest } from "../model/friendRequest.model.js";

// Friend controller: handles sending, accepting, rejecting, listing, and removing friends.

export const sendFriendRequest = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId } = req.body; // username or ObjectId

    // Commit details: validate input, prevent self-request, check friendship status, and create pending request
    if (!receiverId) {
      return res.status(400).json({
        success: false,
        message: "Username is required.",
      });
    }

    // Find sender by current authenticated user
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

    // Prevent sending a request to yourself
    if (sender._id.toString() === receiver._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot send a friend request to yourself.",
      });
    }

    // Prevent duplicate friend relationships
    const isFriend = sender.friends.some(
      (friendId) => friendId.toString() === receiver._id.toString()
    );

    if (isFriend) {
      return res.status(400).json({
        success: false,
        message: "You are already friends.",
      });
    }

    // Prevent duplicate pending requests in either direction
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

    // Commit details: verify request exists, authorize receiver, mark accepted, update friend lists
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

    // Commit details: verify request, authorize receiver, and mark it rejected
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
    // Commit details: return all pending friend requests received by current user
    const requests = await FriendRequest.find({
      receiver: req.user.id,
      status: "pending",
    }).populate("sender", "username name email");

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

export const getSentFriendRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    // Commit details: return pending friend requests sent by current user
    const requests = await FriendRequest.find({
      sender: userId,
      status: "pending",
    })
      .populate("receiver", "username name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      payload: requests,
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
    // Commit details: return user friends list with selected profile fields
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

    // Commit details: remove friend references from both users
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

    // Commit details: return pending friend requests for receiver sorted by newest first
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