import { configureStore } from '@reduxjs/toolkit'
import authSlice from '../redux/authSlice.js'
import chatReducer from './chat/Chatslice.js'

export const authstor = configureStore({
  reducer: {
    authinfoSlice: authSlice,
    chat: chatReducer,
  },
})