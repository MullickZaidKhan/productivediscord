import { api } from "../axios.js";

export const sendDirectMessage = (data) =>
  api.post("chat/directMessage/send-directMessage", data);

export const getDirectMessages = (userId) =>
  api.get(`chat/directMessage/direct-message/${userId}`);

// Get users I have talked to 
export const getTalkedUsers = () => 
  api.get("chat/directMessage/direct-messagechatUsers");