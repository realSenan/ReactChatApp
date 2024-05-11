import { PiArrowFatRightFill } from "react-icons/pi";
import ChatArea from "./ChatArea";
import Header from "./Header";
import MessageType from "./Message";
import { useDispatch, useSelector } from "react-redux";
import { chatStpreType, closeContact } from "../../redux/chatStore";

const Chat = () => {
  const dispatch = useDispatch();
  const handleContact = () => {
    dispatch(closeContact());
  };
  const { isContactClose, chatId } = useSelector(
    ({ chatStore }: { chatStore: chatStpreType }) => chatStore
  );

  return (
    <section className={`chat`}>
      <div
        className={`close-icon ${
          chatId ? (isContactClose ? "active" : "") : ""
        } `}
        onClick={handleContact}
      >
        <PiArrowFatRightFill size={23} />
      </div>

      <Header />
      <ChatArea />
      <MessageType />
    </section>
  );
};

export default Chat;
