import { useEffect, useRef, useState } from "react";
import UserMessage from "./UserMessage";
import { doc, DocumentData, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useSelector } from "react-redux";
import { chatStpreType } from "../../redux/chatStore";
import { ensureGlobalChatExists, GLOBAL_CHAT_ID } from "../../redux/Thunk/Auth";
import { CurrentUserType } from "../../redux/authSlice";

interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}

export interface SeenUser {
  id: string;
  username: string;
  avatar: string | null;
  gender?: string;
}

export interface Message {
  id?: string;
  createdAt: FirestoreTimestamp;
  senderId: string;
  senderName?: string;
  senderAvatar?: string | null;
  senderGender?: string;
  senderEmail?: string;
  text: string;
  seenBy?: SeenUser[];
}

export interface MessageType {
  createdAt: FirestoreTimestamp;
  messages: Message[];
}

const ChatArea = () => {
  const scrollBottom = useRef<HTMLDivElement>(null);
  const [chat, setChat] = useState<MessageType | undefined | DocumentData>();

  const chatStore = useSelector(
    ({ chatStore }: { chatStore: chatStpreType }) => chatStore
  );
  const { currentUser } = useSelector(
    ({ auth }: { auth: { currentUser: CurrentUserType } }) => auth
  );

  useEffect(() => {
    scrollBottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages?.length]);

  useEffect(() => {
    let unSub: (() => void) | undefined;
    if (chatStore.chatId) {
      unSub = onSnapshot(doc(db, "chats", chatStore.chatId), async (res) => {
        if (!res.exists() && chatStore.chatId === GLOBAL_CHAT_ID) {
          ensureGlobalChatExists();
        } else {
          const data = res.data();
          setChat(data);

          // Mark messages from others as seen by currentUser
          if (data?.messages && currentUser?.id && chatStore.chatId) {
            let hasUnseen = false;
            const updatedMessages = data.messages.map((msg: Message) => {
              if (msg.senderId === currentUser.id) return msg;
              const seenList: SeenUser[] = msg.seenBy || [];
              const alreadySeen = seenList.some(
                (u) => u.id === currentUser.id
              );
              if (!alreadySeen) {
                hasUnseen = true;
                return {
                  ...msg,
                  seenBy: [
                    ...seenList,
                    {
                      id: currentUser.id,
                      username: currentUser.username,
                      avatar: currentUser.avatar || null,
                      gender: currentUser.gender || "unspecified",
                    },
                  ],
                };
              }
              return msg;
            });

            if (hasUnseen) {
              try {
                await updateDoc(doc(db, "chats", chatStore.chatId), {
                  messages: updatedMessages,
                });
              } catch (err) {
                console.error("Failed to update seenBy:", err);
              }
            }
          }
        }
      });
    }
    return () => {
      if (unSub) unSub();
    };
  }, [
    chatStore.chatId,
    currentUser?.id,
    currentUser?.username,
    currentUser?.avatar,
    currentUser?.gender,
  ]);

  return (
    <div className="messages">
      {(!chat?.messages || chat.messages.length === 0) && (
        <div className="empty-chat-notice">
          No messages yet. Be the first to say hello!
        </div>
      )}
      {chat?.messages?.map((message: Message, i: number) => (
        <UserMessage chat={message} key={message.id || i} />
      ))}

      <div ref={scrollBottom} />
    </div>
  );
};

export default ChatArea;


