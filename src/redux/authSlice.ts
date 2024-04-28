import { createSlice } from "@reduxjs/toolkit";

import { login } from "./Thunk/Auth";

interface AuthTypes {
  currentUser: boolean | null;
  isLoading: boolean | null;
}

const initialState: AuthTypes = {
  currentUser: false,
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log(action.payload);
        state.isLoading = false;
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

// export const {} = authSlice.actions;
export default authSlice.reducer;
