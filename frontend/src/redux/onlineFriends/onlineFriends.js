import { createSlice } from "@reduxjs/toolkit";
import reducer from "../authSlice";

const initialState = {
    ONLINE_USERS:[],
}
export const onlineFriendsslice = createSlice({
    name: "ONLINEUSERS",
    initialState,
    reducers:{
        setonlineuser:(state, action)=>{
            state.ONLINE_USERS=action.payload
        },
        removeonlineuser:(state)=>{
            state.ONLINE_USERS=[]
        }
    }
})
export const{setonlineuser,removeonlineuser}=onlineFriendsslice.actions
export default onlineFriendsslice.reducer