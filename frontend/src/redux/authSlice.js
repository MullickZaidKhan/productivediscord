import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  login: false,
  userinfo: {},
};
export const authSlice = createSlice({
  name: "auth",
  initialState,
  // reducers: {
  //     setLogin: (state, action) => {
  //         state.login = Boolean(action.payload);
  //         console.log(action.payload)
  //     },
  //     setUser: (state, action) => {
  //         state.userinfo = action.payload || {};
  //     },
  //     setLogout: (state) => {
  //         state.login = false;
  //         state.userinfo = {};
  //     }

  // },
  reducers: {
    setLoggedIn: (state, action) => {
      state.login = true;
      state.userinfo = action.payload;
    },
    setLoggedOut: (state) => {
      state.login = false;
      state.userinfo = null;
    },
  },
});
// export const { setLogin, setUser, setLogout } = authSlice.actions;
export const { setLoggedIn, setLoggedOut } = authSlice.actions;
export default authSlice.reducer;
