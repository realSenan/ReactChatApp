import React from "react";
import user from "../../../assets/user.png";
import {
  arrayUnion,
  collection,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { CurrentUserType } from "../../../redux/authSlice";

interface Props {
  avatar: string | null;
  name: string;
  userId: string;
  close: () => void;
}

const ResultUser: React.FC<Props> = ({ avatar, name, userId }) => {
  const { currentUser } = useSelector(
    ({ auth }: { auth: { currentUser: CurrentUserType } }) => auth
  );

  const handleAdd = async () => {
    const chatRef = collection(db, "chats");
    const userChatRef = collection(db, "userchats");

    try {
      const newChatRef = doc(chatRef);

      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(userChatRef, userId), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          reciverId: currentUser.id,
          updatedAt: Date.now(),
        }),
      });

      await updateDoc(doc(userChatRef, currentUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          reciverId: userId,
          updatedAt: Date.now(),
        }),
      });

      console.log(newChatRef.id);
      close();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        console.error(error.message);
      }
    }
  };

  return (
    <figure className="result-user">
      <img src={avatar || user} alt="" />

      <figcaption className="result-user-description">
        <h3>{name}</h3>
        <button onClick={handleAdd}>Add</button>
      </figcaption>
    </figure>
  );
};

export default ResultUser;
