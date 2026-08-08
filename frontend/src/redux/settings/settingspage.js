import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showAccountSettings: false,
};

export const AccountSettingsslice = createSlice({
  name: "showAccountSettings",
  initialState,
  reducers: {
    openAccountSettings:(state)=>{
        state.showAccountSettings=true
    },
    closeAccountSettings:(state)=>{
        state.showAccountSettings=false
    }
  },
});



export const { openAccountSettings, closeAccountSettings} = AccountSettingsslice.actions;
export default AccountSettingsslice.reducer;