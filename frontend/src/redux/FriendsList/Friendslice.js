import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Tab: "Online",
};

export const Friendslice = createSlice({
  name: "Friendstab",
  initialState,
  reducers: {
    setTab: (state, action) => {
      state.Tab = action.payload;
    },
  },
});

export const { setTab } = Friendslice.actions;
export default Friendslice.reducer;
