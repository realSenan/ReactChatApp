import React from "react";
import { IoCheckmarkSharp } from "react-icons/io5";
import userAvatar from "../../assets/user.png";
import { Message } from "./ChatArea";
import { useSelector } from "react-redux";
import { CurrentUserType } from "../../redux/authSlice";
import { chatStpreType } from "../../redux/chatStore";

interface Props {
  chat: Message;
}

const UserMessage: React.FC<Props> = ({ chat }) => {
  // console.log(chat);

  const { currentUser } = useSelector(
    ({ auth }: { auth: { currentUser: CurrentUserType } }) => auth
  );

  const chatInfo = useSelector(
    ({ chatStore }: { chatStore: chatStpreType }) => chatStore
  );

  return (
    <div className="message">
      {chat.img && (
        <img
          src={chat.img}
          className={`img ${currentUser.id == chat.senderId ? "own" : ""}`}
        />
      )}
      <div className="text-wrapper">
        {currentUser.id != chat.senderId ? (
          <img id="profile" src={chatInfo.user?.avatar || userAvatar} />
        ) : null}
        <div className="text-main">
          <div
            className={`text ${currentUser.id == chat.senderId ? "own" : ""}`}
          >
            {chat.text}
            <div className="seen">
              <IoCheckmarkSharp size={15} />
              <IoCheckmarkSharp size={15} />
            </div>
          </div>
          <div className="time">1 min ago</div>
        </div>
      </div>
    </div>
  );
};

export default UserMessage;
