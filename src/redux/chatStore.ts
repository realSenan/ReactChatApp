import { createSlice } from "@reduxjs/toolkit";
import { CurrentUserType } from "./authSlice";
import { GLOBAL_CHAT_ID } from "./Thunk/Auth";

export interface chatStpreType {
  chatId: string | null;
  user: CurrentUserType | null;
  isCurrentUserBlocked: boolean;
  isReciverBlocked: boolean;
  isContactClose: boolean;
  isDetailsClose: boolean;
  profileModalUser: CurrentUserType | null;
}

const initialState: chatStpreType = {
  chatId: GLOBAL_CHAT_ID,
  user: null,
  isCurrentUserBlocked: false,
  isReciverBlocked: false,
  isContactClose: false,
  isDetailsClose: false,
  profileModalUser: null,
};

const chatStore = createSlice({
  name: "chatStore",
  initialState,
  reducers: {
    changeChat: (state, action) => {
      const { chatId, user, currentUser } = action.payload;

      if (chatId === GLOBAL_CHAT_ID || !user) {
        state.chatId = GLOBAL_CHAT_ID;
        state.user = null;
        state.isCurrentUserBlocked = false;
        state.isReciverBlocked = false;
        return;
      }

      if (user.blocked?.includes(currentUser?.id)) {
        state.user = user;
        state.chatId = chatId;
        state.isCurrentUserBlocked = true;
        state.isReciverBlocked = false;
      } else if (currentUser?.blocked?.includes(user.id)) {
        state.user = user;
        state.chatId = chatId;
        state.isCurrentUserBlocked = false;
        state.isReciverBlocked = true;
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
    setProfileModalUser: (state, action) => {
      state.profileModalUser = action.payload;
    },
  },
});

export const {
  changeChat,
  changeBlock,
  closeContact,
  closeDetails,
  setProfileModalUser,
} = chatStore.actions;
export default chatStore.reducer;

