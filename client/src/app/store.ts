import { configureStore } from "@reduxjs/toolkit";
import manageUserSlice from '../features/admin/manageUserSlice'
import userSlice from '../features/user/userSlice' 


export const store= configureStore({
    reducer:{
        admin:manageUserSlice,
        user:userSlice
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch