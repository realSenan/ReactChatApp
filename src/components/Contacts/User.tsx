import React from "react";
import userAvatar from "../../assets/user.png";
import { CurrentUserType } from "../../redux/authSlice";
import { changeChat } from "../../redux/chatStore";
import { useDispatch, useSelector } from "react-redux";
import { AuthState } from "../../App";

export interface ChatDataType {
  chatList: UserType;
  user: CurrentUserType;
}

export interface UserType {
  chatId: string;
  lastMessage: string;
  reciverId: string;
  updatedAd: number;
}

interface Props {
  user: ChatDataType;
}

const User: React.FC<Props> = ({ user }) => {
  const { avatar, username } = user.user;
  const { lastMessage, chatId } = user.chatList;
  const dispatch = useDispatch();
  const { currentUser } = useSelector(
    ({ auth }: { auth: { currentUser: AuthState } }) => auth
  );

  const handlerChat = () => {
    dispatch(changeChat({ chatId, user: user.user, currentUser }));
  };

  return (
    <figure onClick={handlerChat} className="user-left-prev">
      <img src={avatar || userAvatar} alt="" />

      <figcaption className="">
        <h2 className="line-1-column">{username}</h2>
        <h3 className="line-1-column">{lastMessage}</h3>
      </figcaption>
    </figure>
  );
};

export default User;
