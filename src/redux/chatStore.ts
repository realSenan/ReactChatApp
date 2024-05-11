import { createSlice } from "@reduxjs/toolkit";
import { CurrentUserType } from "./authSlice";

export interface chatStpreType {
  chatId: string | null;
  user: CurrentUserType | null;
  isCurrentUserBlocked: boolean;
  isReciverBlocked: boolean;
  isContactClose: boolean;
  isDetailsClose: boolean;
}

const initialState: chatStpreType = {
  chatId: null,
  user: null,
  isCurrentUserBlocked: false,
  isReciverBlocked: false,
  isContactClose: false,
  isDetailsClose: false,
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
    changeBlock: (state) => {
      state.isReciverBlocked = !state.isReciverBlocked;
    },
    closeContact: (state) => {
      state.isContactClose = !state.isContactClose;
    },
    closeDetails: (state) => {
      state.isDetailsClose = !state.isDetailsClose;
    },
  },
});

export const { changeChat, changeBlock, closeContact, closeDetails } =
  chatStore.actions;
export default chatStore.reducer;
