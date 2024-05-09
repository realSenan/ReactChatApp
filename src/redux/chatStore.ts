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

      if (user.blocked.includes(currentUser?.id)) {
        state.user = null;
        state.chatId = chatId;
        state.isCurrentUserBlocked = !state.isCurrentUserBlocked;
        state.isReciverBlocked = false;
      } else if (currentUser?.blocked.includes(user.id)) {
        state.user = user;
        state.chatId = chatId;
        state.isCurrentUserBlocked = false;
        state.isReciverBlocked = !state.isReciverBlocked;
      } else {
        state.user = user;
        state.chatId = chatId;
        state.isReciverBlocked = false;
        state.isCurrentUserBlocked = false;
      }
    },
  },
});

export const { changeChat } = chatStore.actions;
export default chatStore.reducer;
