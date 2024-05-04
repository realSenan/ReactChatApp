import { createSlice } from "@reduxjs/toolkit";
import { CurrentUserType } from "./authSlice";

export interface chatStpreType {
  chatId: string | null;
  user: CurrentUserType | null;
  isCurrentUserBlocked: boolean;
  isReciverBlocked: boolean;
}

const initialState: chatStpreType = {
  chatId: null,
  user: null,
  isCurrentUserBlocked: false,
  isReciverBlocked: false,
};

const chatStore = createSlice({
  name: "chatStore",
  initialState,
  reducers: {
    changeChat: (state, action) => {
      const { chatId, user, currentUser } = action.payload;

      switch (true) {
        case user.blocked.includes(currentUser?.id):
          state.user = null;
          state.isReciverBlocked = true;
          break;
        case currentUser?.blocked.includes(user.id):
          state.user = user;
          state.isReciverBlocked = true;
          break;
        default:
          state.chatId = chatId;
          state.user = user;
          state.isCurrentUserBlocked = false;
          state.isReciverBlocked = false;
          break;
      }
    },
  },
});

export const { changeChat } = chatStore.actions;
export default chatStore.reducer;
