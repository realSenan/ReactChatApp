import { useEffect, useRef, useState } from "react";
import UserMessage from "./UserMessage";
import { doc, DocumentData, onSnapshot } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useSelector } from "react-redux";
import { chatStpreType } from "../../redux/chatStore";

interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}

export interface Message {
  createdAt: FirestoreTimestamp;
  senderId: string;
  text: string;
}

export interface MessageType {
  createdAt: FirestoreTimestamp;
  messages: Message[];
}

const ChatArea = () => {
  const scrollBottom = useRef<HTMLDivElement>(null);
  const [chat, setChat] = useState<MessageType | undefined | DocumentData>();

  // console.log(chat);

  const chatStore = useSelector(
    ({ chatStore }: { chatStore: chatStpreType }) => chatStore
  );

  useEffect(() => {
    scrollBottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  useEffect(() => {
    let unSub: () => void;
    if (chatStore.chatId) {
      unSub = onSnapshot(doc(db, "chats", chatStore.chatId), (res) => {
        setChat(res.data());
      });
    }
    return () => {
      unSub();
    };
  }, [chatStore.chatId]);

  return (
    <div className="messages">
      {chat?.messages?.map((message: Message,i : number) => (
        <UserMessage chat={message} key={i}/>
      ))}

      <div ref={scrollBottom} />
    </div>
  );
};

export default ChatArea;
