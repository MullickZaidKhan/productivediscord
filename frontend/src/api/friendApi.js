import{ api} from "./axios.js";

// Send Friend Request
export const sendFriendRequest = ({ senderId, receiverId }) =>
  api.post("/friends/request", { senderId, receiverId });

// Accept Friend Request
export const acceptFriendRequest = (requestId) =>
  api.patch(`/friends/accept/${requestId}`);

// Reject Friend Request
export const rejectFriendRequest = (requestId) =>
  api.patch(`/friends/reject/${requestId}`);

// Get Pending Friend Requests
export const getFriendRequests = () =>
  api.get("/friends/requests");

// Get Friends List
export const getFriends = () =>
  api.get("/friends");

// Remove Friend
export const removeFriend = (friendId) =>
  api.delete(`/friends/${friendId}`);

export const getPendingFriendRequests = () =>
  api.get("/friends/pending");

export const getSentFriendRequests = () =>
  api.get("/friends/sent");