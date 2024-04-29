import { createSlice } from "@reduxjs/toolkit";
import { login } from "./Thunk/Auth";

interface AuthTypes {
  currentUser: null | undefined | object;
  isLoading: boolean | null;
}

const initialState: AuthTypes = {
  currentUser: null,
  isLoading: true,
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
        state.currentUser = action.payload;
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

// export const {} = authSlice.actions;
export default authSlice.reducer;
