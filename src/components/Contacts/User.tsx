import React, { useEffect } from "react";
import { CurrentUserType } from "../../redux/authSlice";
import { changeChat, chatStpreType, closeContact } from "../../redux/chatStore";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import Avatar from "../Common/Avatar";

export interface UserType {
  chatId: string;
  lastMessage: string;
  reciverId: string;
  isSeen: boolean;
  unreadCount?: number;
  updatedAt?: number;
  updatedAd?: number;
}

export interface ChatDataType {
  chatItem: UserType;
  chatList: UserType[];
  user: CurrentUserType;
}

interface Props {
  user: ChatDataType;
  chatData: Array<ChatDataType>;
  index: number;
}

const User: React.FC<Props> = ({ user }) => {
  const dispatch = useDispatch();
  const { avatar, username, gender } = user.user || {
    avatar: null,
    username: "User",
    gender: "unspecified",
  };
  const { lastMessage, chatId, isSeen, unreadCount: rawUnread } = user.chatItem;

  const { currentUser } = useSelector(
    ({ auth }: { auth: { currentUser: CurrentUserType } }) => auth
  );
  const { chatId: activeChatId, isContactClose } = useSelector(
    ({ chatStore }: { chatStore: chatStpreType }) => chatStore
  );

  const isActive = activeChatId === chatId;
  const unreadCount = rawUnread !== undefined ? rawUnread : !isSeen ? 1 : 0;

  // If this chat is currently open and has unread messages, mark it as read automatically
  useEffect(() => {
    if (isActive && (!isSeen || unreadCount > 0) && currentUser?.id) {
      const userChatRef = doc(db, "userchats", currentUser.id);
      const updatedChats = user.chatList.map((item) =>
        item.chatId === chatId
          ? { ...item, isSeen: true, unreadCount: 0 }
          : item
      );
      updateDoc(userChatRef, { chats: updatedChats }).catch(console.error);
    }
  }, [isActive, isSeen, unreadCount, currentUser?.id, chatId, user.chatList]);

  const handlerChat = async () => {
    dispatch(changeChat({ chatId, user: user.user, currentUser }));
    if (window.innerWidth <= 925 && isContactClose) {
      dispatch(closeContact());
    }

    if (!isSeen || unreadCount > 0) {
      const userChatRef = doc(db, "userchats", currentUser.id);
      const updatedChats = user.chatList.map((item) =>
        item.chatId === chatId
          ? { ...item, isSeen: true, unreadCount: 0 }
          : item
      );

      try {
        await updateDoc(userChatRef, {
          chats: updatedChats,
        });
      } catch (e) {
        if (e instanceof Error) {
          console.error(e.message);
          toast.error(e.message);
        }
      }
    }
  };

  return (
    <figure
      onClick={handlerChat}
      className={`user-left-prev ${isActive ? "active-chat" : ""} ${
        !isActive && unreadCount > 0 ? "unread-chat" : ""
      }`}
    >
      <Avatar src={avatar} gender={gender} alt={username} />

      <figcaption className="contact-item-caption">
        <div className="contact-item-top">
          <h2 className="line-1-column">{username}</h2>
          {!isActive && unreadCount > 0 && (
            <span className="unread-badge">{unreadCount}</span>
          )}
        </div>
        <h3 className="line-1-column">{lastMessage || "No messages yet"}</h3>
      </figcaption>
    </figure>
  );
};

export default User;



