import React from "react";
import userAvatar from "../../assets/user.png";
import { CurrentUserType } from "../../redux/authSlice";
import { changeChat } from "../../redux/chatStore";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

export interface ChatDataType {
  chatList: UserType[];
  user: CurrentUserType;
}

export interface UserType {
  chatId: string;
  lastMessage: string;
  reciverId: string;
  isSeen: boolean;
  updatedAd: number;
}

interface Props {
  user: ChatDataType;
  chatData: Array<ChatDataType>;
  index: number;
}

const User: React.FC<Props> = ({ user, chatData, index }) => {
  const dispatch = useDispatch();
  const { avatar, username } = user.user;
  const { lastMessage, chatId } = user.chatList[index];

  const { currentUser } = useSelector(
    ({ auth }: { auth: { currentUser: CurrentUserType } }) => auth
  );

  const handlerChat = async () => {
    const onlyChatData: UserType[][] = chatData.map((item) => {
      const { user, ...rest } = item;
      user;
      return rest.chatList;
    });

    const chatIndex = onlyChatData.findIndex((item) => {
      return item[index].chatId == user.chatList[index].chatId;
    });

    chatData[chatIndex].chatList[index].isSeen = true;

    const userChatRef = doc(db, "userchats", currentUser.id);

    const newData = Object.values(user.chatList).flatMap(
      (innerArray) => innerArray
    );

    try {
      await updateDoc(userChatRef, {
        chats: newData,
      });

      dispatch(changeChat({ chatId, user: user.user, currentUser }));
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message);
        toast.error(e.message);
      }
    }
  };

  return (
    <figure
      onClick={handlerChat}
      className={`user-left-prev ${!user.chatList[index].isSeen ? "seen" : ""}`}
    >
      <img src={avatar || userAvatar} alt="" />

      <figcaption className="">
        <h2 className="line-1-column">{username}</h2>
        <h3 className="line-1-column">{lastMessage}</h3>
      </figcaption>
    </figure>
  );
};

export default User;
