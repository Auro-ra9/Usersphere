import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserInitialStateType = {
    isLogin: boolean;
    name: string;
    email: string;
}

const initialState:UserInitialStateType = {
    isLogin: false,
    name: '',
    email:'',
}




const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        onLogin(state, action: PayloadAction<UserInitialStateType>) {
            state.isLogin = true;
            state.email = action.payload.email;
            state.name = action.payload.name;
        },
        onLogout(state) {
            state.email = ''
            state.isLogin = false
            state.name=''
        },
        
    }
})


export const {onLogin,onLogout } = userSlice.actions;


export default userSlice.reducer;