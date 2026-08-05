import {api} from "../api/axios";

// Get all backgrounds (Public)
export const getAllBackgrounds = async () => {
  const { data } = await api.get("/background/all");
  return data;
};
// Get logged-in user's background
export const getUserBackground = async () => {
  try {
    const { data } = await api.get("/background/user-background");
    return data;
  } catch (err) {
    // If the server responds 404 (no background set), return a consistent
    // shape so the UI can fallback to the default id instead of erroring.
    if (err?.response?.status === 404) {
      return { success: false, data: null };
    }
    throw err;
  }
};

// Update logged-in user's background
export const setUserBackground = async (backgroundId) => {
  const { data } = await api.put("/background/user-background", {
    backgroundId,
  });

  return data;
};