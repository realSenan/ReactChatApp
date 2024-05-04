import ChatArea from "./ChatArea";
import Header from "./Header";
import MessageType from "./Message";

const Chat = () => {
  return (
    <section className="chat">
      <Header />
      <ChatArea />
      <MessageType />
    </section>
  );
};

export default Chat;
