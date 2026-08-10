import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showProfilePageSettings: false,
};

export const showProfilePageSettingsslice = createSlice({
  name: "showProfilePageSettings",
  initialState,
  reducers: {
    openProfilePageSettings:(state)=>{
        state.showProfilePageSettings=true
    },
    closeProfilePageSettings:(state)=>{
        state.showProfilePageSettings=false
    }
  },
});

export const { openProfilePageSettings, closeProfilePageSettings} = showProfilePageSettingsslice.actions;

export default showProfilePageSettingsslice.reducer;