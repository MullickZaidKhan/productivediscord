import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showProfilePagechange: false,
};

export const showProfilePagechangeslice = createSlice({
  name: "showProfilePagechange",
  initialState,

  reducers: {
    openProfilePagechange: (state) => {

      state.showProfilePagechange = true;

console.log(
  "PROFILE REDUX VALUE:",
  showProfilePagechange
);
    },

    closeProfilePagechange: (state) => {
      state.showProfilePagechange = false;
    },
  },
});

export const {
  openProfilePagechange,
  closeProfilePagechange,
} = showProfilePagechangeslice.actions;

export default showProfilePagechangeslice.reducer;