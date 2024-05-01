import { createSlice } from "@reduxjs/toolkit";
import { login } from "./Thunk/Auth";

export interface CurrentUserType {
  avatar: string | null;
  blocked: Array<object>;
  email: string;
  id: string;
  username: string;
}

export interface AuthTypes {
  currentUser: null | CurrentUserType;
  isLoading: boolean | null;
}

const initialState: AuthTypes = {
  currentUser: null,
  isLoading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOut: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) state.currentUser = action.payload;
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { logOut } = authSlice.actions;
export default authSlice.reducer;
