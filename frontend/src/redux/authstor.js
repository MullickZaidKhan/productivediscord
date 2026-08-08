import { configureStore } from '@reduxjs/toolkit'
import authSlice from '../redux/authSlice.js'
import chatReducer from './chat/Chatslice.js'
import AccountSettingsslice from "./settings/settingspage.js"
export const authstor = configureStore({
  reducer: {
    authinfoSlice: authSlice,
    chat: chatReducer,
    AccountSettings:AccountSettingsslice,
  },
})