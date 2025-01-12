import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ThemeMode = 'light' | 'dark';

export type InitialStateType = {
  mode: ThemeMode;
};

const initialState: InitialStateType = {
  mode: 'light'
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
    }
  }
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;