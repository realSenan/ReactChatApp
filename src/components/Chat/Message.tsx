import { FaMicrophone } from "react-icons/fa";
import { IoMdCamera } from "react-icons/io";
import { MdPhotoSizeSelectActual } from "react-icons/md";
import { FaFaceSmileWink } from "react-icons/fa6";
import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";

interface EmojiType {
  emoji: string;
}

const Message = () => {
  const [text, setText] = useState("");
  const [emoji, setEmoji] = useState(false);
  const picker = useRef<HTMLButtonElement | null>(null);

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

      <button className="icon-send-message">Send</button>
    </div>
  );
};

export default Message;
