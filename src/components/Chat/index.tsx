import Header from "./Header";
import MessageType from "./Message";
import UserMessage from "./UserMessage";

const Chat = () => {
  return (
    <section className="chat">
      <Header />
      <div className="messages">
        <UserMessage />
        <UserMessage own/>
        <UserMessage />
      </div>
      <MessageType />
    </section>
  );
};

export default Chat;
