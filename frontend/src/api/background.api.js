import {api} from "../api/axios";

// Get all backgrounds (Public)
export const getAllBackgrounds = async () => {
  const { data } = await api.get("/background/all");
  return data;
};
// Get logged-in user's background
export const getUserBackground = async () => {
  const { data } = await api.get("/background/user-background");
  return data;
};

// Update logged-in user's background
export const setUserBackground = async (backgroundId) => {
  const { data } = await api.put("/background/user-background", {
    backgroundId,
  });

  return data;
};