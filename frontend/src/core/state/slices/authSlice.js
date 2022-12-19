import {createSlice} from '@reduxjs/toolkit'
import localforage from "localforage";

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: (await localforage.getItem('token')),
        is_authenticated: false,
        user_data: {
        }

    },
    reducers: {

        async invokeToken(state) {
            await localforage.removeItem("token");
            state.token = null;
            state.state.is_authenticated = false;
            state.user_data = {}
        },
        async setOrUpdateAuthenticationInfo(state, action) {
            // set token in localStorage
            state.is_authenticated = true;
            state.token = action.payload.token;
            state.user_data = action.payload.user_data;
        }

    },
})


export const { invokeToken , setOrUpdateAuthenticationInfo} = authSlice.actions

export default authSlice.reducer