import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserType = {
  name: string;
  email: string;
  id: string;
};

export type InitialStateType = {
  users: UserType[];
  loading: boolean;
  error: string;
};

const initialState: InitialStateType = {
  users: [],
  error: "",
  loading: false,
};

// Create slice
const ManageUserSlice = createSlice({
  name: "ManageUser",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<UserType[]>) => {
      state.users = action.payload;
    },
    appendUser: (state, action: PayloadAction<UserType>) => {
      // Append the new user to the existing users array
      state.users.push(action.payload);
    },
    updateUser: (state, action: PayloadAction<UserType>) => {
      const index = state.users.findIndex((user) => user.id === action.payload.id);
      if (index !== -1) {
        // Update user data
        state.users[index] = { ...state.users[index], ...action.payload };
      }
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((user) => user.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const { addUser, appendUser, deleteUser, updateUser, setLoading, setError } = ManageUserSlice.actions;
export default ManageUserSlice.reducer;
