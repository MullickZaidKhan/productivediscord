import { configureStore } from '@reduxjs/toolkit'
import authSlice from '../redux/authSlice.js'

export const authstor = configureStore({
  reducer: {
    authinfoSlice: authSlice,
  },
})