import { MdPhotoSizeSelectActual } from "react-icons/md";
import { FaFaceSmileWink } from "react-icons/fa6";
import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useSelector } from "react-redux";
import { chatStpreType } from "../../redux/chatStore";
import { CurrentUserType } from "../../redux/authSlice";
import { FaMicrophone } from "react-icons/fa";
import { GLOBAL_CHAT_ID } from "../../redux/Thunk/Auth";

interface EmojiType {
  emoji: string;
}

const Message = () => {
  const [text, setText] = useState("");
  const [emoji, setEmoji] = useState(false);
  const picker = useRef<HTMLButtonElement | null>(null);

  const chatInfo = useSelector(
    ({ chatStore }: { chatStore: chatStpreType }) => chatStore
  );
  const { currentUser } = useSelector(
    (state: { auth: { currentUser: CurrentUserType } }) => state.auth
  );

  const emojiHandler = (e: EmojiType) => {
    setText((prev) => prev + e.emoji);
  };

  const handleUnsupportedMedia = () => {
    toast.warning("Unsupported feature at the moment");
  };

  useEffect(() => {
    const closeEmoji = (e: MouseEvent) => {
      !picker.current?.contains(e.target as Node) && setEmoji(false);
    };

    if (emoji) {
      window.addEventListener("click", closeEmoji);
    }

    return () => {
      window.removeEventListener("click", closeEmoji);
    };
  }, [emoji]);

  const handlerSubmit = async () => {
    if (text.trim() === "") return;

    const messageText = text.trim();
    setText("");

    try {
      if (chatInfo.chatId) {
        await updateDoc(doc(db, "chats", chatInfo.chatId), {
          messages: arrayUnion({
            id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            senderId: currentUser.id,
            senderName: currentUser.username,
            senderAvatar: currentUser.avatar || null,
            senderGender: currentUser.gender || "unspecified",
            senderEmail: currentUser.email || "",
            text: messageText,
            createdAt: new Date(),
            seenBy: [],
          }),
        });

        if (chatInfo.chatId !== GLOBAL_CHAT_ID) {
          const userIDs = [currentUser.id, chatInfo.user?.id];

          userIDs.forEach(async (id) => {
            if (id) {
              const usercChatRef = doc(db, "userchats", id);
              const userChatsSnapshot = await getDoc(usercChatRef);

              if (userChatsSnapshot.exists()) {
                const userChatData = userChatsSnapshot.data();
                const chatIndex = userChatData.chats.findIndex(
                  (c: chatStpreType) => c.chatId === chatInfo.chatId
                );

                if (chatIndex !== -1) {
                  userChatData.chats[chatIndex].lastMessage = messageText;
                  const isOwnChatDoc = id === currentUser.id;
                  userChatData.chats[chatIndex].isSeen = isOwnChatDoc;
                  userChatData.chats[chatIndex].unreadCount = isOwnChatDoc
                    ? 0
                    : (userChatData.chats[chatIndex].unreadCount || 0) + 1;
                  userChatData.chats[chatIndex].updatedAt = Date.now();

                  await updateDoc(usercChatRef, {
                    chats: userChatData.chats,
                  });
                }
              }
            }
          });
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        toast.error(error.message);
      }
    }
  };

  const { isReciverBlocked, isCurrentUserBlocked, chatId } = useSelector(
    ({ chatStore }: { chatStore: chatStpreType }) => chatStore
  );

  const isDisabled =
    chatId !== GLOBAL_CHAT_ID && (isReciverBlocked || isCurrentUserBlocked);

  return (
    <div className={`type-wrapper ${isDisabled ? "disabled" : ""}`}>
      <button
        type="button"
        className="unsupported-icon-btn"
        onClick={handleUnsupportedMedia}
        title="Unsupported feature at the moment"
      >
        <MdPhotoSizeSelectActual size={22} />
      </button>

      <button
        type="button"
        className="unsupported-icon-btn"
        onClick={handleUnsupportedMedia}
        title="Unsupported feature at the moment"
      >
        <FaMicrophone size={22} />
      </button>

      <div className="inp-wrapper">
        <input
          onChange={(e) => setText(e.target.value)}
          type="text"
          value={text}
          id="msg-input"
          disabled={isDisabled}
          placeholder={
            isDisabled
              ? "You cannot send messages to this chat"
              : "Type a message..."
          }
          onKeyDown={(e) => (e.key == "Enter" ? handlerSubmit() : () => {})}
        />
      </div>

      <button type="button" className="icon-pick" ref={picker}>
        <FaFaceSmileWink size={22} onClick={() => setEmoji((prev) => !prev)} />

        <div className="picker">
          <EmojiPicker
            theme={Theme.DARK}
            open={emoji}
            emojiStyle={EmojiStyle.APPLE}
            onEmojiClick={emojiHandler}
          />
        </div>
      </button>

      <button
        type="button"
        className="icon-send-message"
        disabled={isDisabled}
        onClick={handlerSubmit}
      >
        Send
      </button>
    </div>
  );
};

export default Message;

