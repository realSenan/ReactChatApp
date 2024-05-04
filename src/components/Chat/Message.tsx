import { FaMicrophone } from "react-icons/fa";
import { IoMdCamera } from "react-icons/io";
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
    setEmoji(false);
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
    if (text === "") return;
    setText("");

    console.log(chatInfo)
    
    try {
      if (chatInfo.chatId) {
        await updateDoc(doc(db, "chats", chatInfo.chatId), {
          messages: arrayUnion({
            senderId: currentUser.id,
            text,
            createdAt: new Date(),
          }),
        });

        const userIDs = [currentUser.id, chatInfo.user?.id];

        userIDs.forEach(async (id) => {
          if (id) {
            const usercChatRef = doc(db, "userchats", id);
            const userChatsSnapshot = await getDoc(usercChatRef);

            if (userChatsSnapshot.exists()) {
              const userChatData = userChatsSnapshot.data();
              console.log('ssssssssssssssssssssssssssss',userChatData.chats)
              const chatIndex = userChatData.chats.findIndex(
                (c: chatStpreType) => c.chatId === chatInfo.chatId
              );

              userChatData.chats[chatIndex].lastMessage = text;
              userChatData.chats[chatIndex].isSeen = id == currentUser.id ? true : false;
              userChatData.chats[chatIndex].updatedAt = Date.now();

              await updateDoc(usercChatRef, {
                chats: userChatData,
              });
            }
          }
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="type-wrapper">
      <MdPhotoSizeSelectActual size={22} />
      <IoMdCamera size={22} />
      <FaMicrophone size={22} />

      <input
        onChange={(e) => setText(e.target.value)}
        type="text"
        value={text}
        id="msg-input"
        placeholder="Type a message..."
        onKeyDown={(e) => (e.key == "Enter" ? handlerSubmit() : () => {})}
      />

      <button className="icon-pick" ref={picker}>
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

      <button className="icon-send-message" onClick={handlerSubmit}>
        Send
      </button>
    </div>
  );
};

export default Message;
