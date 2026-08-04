import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chatopen: false,
  userinfo: {},
};

export const Chatslice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    openChat: (state) => {
      state.chatopen = true;
    },
    closeChat: (state) => {
      state.chatopen = false;
    },
    toggleChat: (state) => {
      state.chatopen = !state.chatopen;
    },
    setUserInfo: (state, action) => {
      state.userinfo = action.payload;
    },

    clearUserInfo: (state) => {
      state.userinfo = {};
    },
  },
});

export const { openChat, closeChat, toggleChat,setUserInfo,clearUserInfo } = Chatslice.actions;
export default Chatslice.reducer;
