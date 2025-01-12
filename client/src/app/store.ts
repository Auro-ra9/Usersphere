import { configureStore } from "@reduxjs/toolkit";
import manageUserSlice from '../features/admin/manageUserSlice'
import userSlice from '../features/user/userSlice' 
import themeSlice from '../features/theme/themeSlice' 


export const store= configureStore({
    reducer:{
        admin:manageUserSlice,
        user:userSlice,
        theme:themeSlice,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch