import { createSlice } from "@reduxjs/toolkit";
import { login } from "./Thunk/Auth";

export interface FriendRequestType {
  fromId: string;
  fromName: string;
  fromAvatar: string | null;
  fromGender?: string;
  createdAt: number;
}

export interface CurrentUserType {
  avatar: string | null;
  gender?: "male" | "female" | "unspecified" | string;
  blocked: string[];
  email: string;
  id: string;
  username: string;
  friends?: string[];
  friendRequests?: FriendRequestType[];
  sentRequests?: string[];
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
    setUser: (state, action) => {
      state.currentUser = action.payload;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload || null;
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { logOut, setUser } = authSlice.actions;
export default authSlice.reducer;

