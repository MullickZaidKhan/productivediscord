import { configureStore } from '@reduxjs/toolkit'
import authSlice from './authSlice.js'
import chatReducer from './chat/Chatslice.js'
import AccountSettingsslice from "./settings/settingspage.js"
import showProfilePageSettingsslice from "./Profile/ProfilePageSettings.js"
import showProfilePagechangeslice from "./Profile/ProfilePagechange.js"
import Friendslice from "./FriendsList/Friendslice.js"
import onlineFriendsslice from "./onlineFriends/onlineFriends.js"
export const authstor = configureStore({
  reducer: {
    authinfoSlice: authSlice,
    chat: chatReducer,
    AccountSettings:AccountSettingsslice,
    ProfilePageSettings:showProfilePageSettingsslice,
    ProfilePagechangeslice:showProfilePagechangeslice,
    Friendlist:Friendslice,
    onlineFriendsslice:onlineFriendsslice,
  },
})