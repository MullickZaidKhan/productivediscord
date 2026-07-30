import { createSlice } from '@reduxjs/toolkit'



const initialState = {
    login: false,
    userinfo: {}
}
export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setLogin: (state, action) => {
            state.login = action.payload
        },
        setUser: (state, action) => {
            state.userinfo = action.payload
        },
        setLogout: (state, action) => {
            state.login = false
        }

    },
})
export const { setLogin, setUser, setLogout } = authSlice.actions;
export default authSlice.reducer; 