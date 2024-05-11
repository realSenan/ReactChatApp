import { MdPhotoSizeSelectActual } from "react-icons/md";
import { FaFaceSmileWink } from "react-icons/fa6";
import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useSelector } from "react-redux";
import { chatStpreType } from "../../redux/chatStore";
import { CurrentUserType } from "../../redux/authSlice";
import upload from "../../lib/upload";
import { ProfileState } from "../Login";
import { FaMicrophone } from "react-icons/fa";

interface EmojiType {
  emoji: string;
}

const Message = () => {
  const [text, setText] = useState("");
  const [emoji, setEmoji] = useState(false);
  const picker = useRef<HTMLButtonElement | null>(null);

  const [img, setImg] = useState<ProfileState>({
    file: null,
    url: "",
  });

  const chatInfo = useSelector(
    ({ chatStore }: { chatStore: chatStpreType }) => chatStore
  );
  const { currentUser } = useSelector(
    (state: { auth: { currentUser: CurrentUserType } }) => state.auth
  );

  const emojiHandler = (e: EmojiType) => {
    setText((prev) => prev + e.emoji);
  };

  const imageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImg({
        file: files[0],
        url: URL.createObjectURL(files[0]),
      });
    }
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

    let imgUrl: string | null = null;

    try {
      if (img.file) {
        imgUrl = (await upload(img.file)) as string | null;
      }

      if (chatInfo.chatId) {
        await updateDoc(doc(db, "chats", chatInfo.chatId), {
          messages: arrayUnion({
            senderId: currentUser.id,
            text,
            createdAt: new Date(),
            ...(imgUrl && { img: imgUrl }),
          }),
        });

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

              userChatData.chats[chatIndex].lastMessage = text;
              userChatData.chats[chatIndex].isSeen =
                id == currentUser.id ? true : false;
              userChatData.chats[chatIndex].updatedAt = Date.now();

              await updateDoc(usercChatRef, {
                chats: userChatData.chats,
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

    setImg({
      file: null,
      url: "",
    });
    setText("");
  };

  const { isReciverBlocked } = useSelector(
    ({ chatStore }: { chatStore: chatStpreType }) => chatStore
  );

  return (
    <div className={`type-wrapper  ${isReciverBlocked ? "disabled" : ""}`}>
      <label htmlFor="img">
        <MdPhotoSizeSelectActual size={22} />
        <input
          type="file"
          id="img"
          style={{ display: "none" }}
          onChange={imageHandler}
        />
      </label>

      <FaMicrophone size={22} />

      <div className="inp-wrapper">
        <input
          onChange={(e) => setText(e.target.value)}
          type="text"
          value={text}
          id="msg-input"
          disabled={isReciverBlocked}
          placeholder="Type a message..."
          onKeyDown={(e) => (e.key == "Enter" ? handlerSubmit() : () => {})}
        />
        {img.file && <img src={img.url} alt="" className="img-prew-box" />}
      </div>

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
