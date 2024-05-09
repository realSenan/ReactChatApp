import React, { useState } from "react";
import DropDown from "./DropDown";
import Photos from "./Photos";
import { signOut } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { useDispatch, useSelector } from "react-redux";
import { CurrentUserType, logOut } from "../../redux/authSlice";
import { toast } from "react-toastify";
import avatar from "../../assets/user.png";
import { changeChat, chatStpreType } from "../../redux/chatStore";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";

interface State {
  chat: boolean;
  privacy: boolean;
  "shared-photos": boolean;
  "shared-files": boolean;
}

const Details = () => {
  const dispatch = useDispatch();
  const [state, setState] = useState<State>({
    chat: false,
    privacy: false,
    "shared-photos": true,
    "shared-files": false,
  });

  const chatStore = useSelector(
    ({ chatStore }: { chatStore: chatStpreType }) => chatStore
  );

  const { currentUser } = useSelector(
    ({ auth }: { auth: { currentUser: CurrentUserType } }) => auth
  );

  const handleBlock = async () => {
    if (!chatStore.user) return;
    const userDocRef = doc(db, "users", currentUser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: chatStore.isReciverBlocked
          ? arrayRemove(chatStore.user.id)
          : arrayUnion(chatStore.user.id),
      });
      dispatch(
        changeChat({
          chatId: chatStore.chatId,
          user: chatStore.user,
          currentUser,
        })
      );//! not working block
      console.log(chatStore)
    } catch (er) {
      if (er instanceof Error) {
        toast.error(er.message);
      }
    }
  };

  const clickHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const id = e.currentTarget.id;
    setState((prev) => ({
      ...prev,
      [id]: !prev[id as keyof State],
    }));
  };

  const logOutHandler = () => {
    signOut(auth).then(() => {
      dispatch(logOut());
      toast.success("Logout success!");
    });
  };

  return (
    <aside className="details">
      <div>
        <figure className="sidebar-profile">
          <img id="profile" src={chatStore.user?.avatar || avatar} alt="" />

          <figcaption>
            <h2>{chatStore.user?.username}</h2>
            <h3>Yatiram</h3>
          </figcaption>
        </figure>

        <section className="dropdown-container">
          <DropDown
            id="chat"
            text="Chat Settings"
            isActive={state.chat}
            changeActive={clickHandler}
          />
          <DropDown
            id="privacy"
            text="Privacy & help"
            isActive={state.privacy}
            changeActive={clickHandler}
          />
          <DropDown
            id="shared-photos"
            text="Shared photos"
            isActive={state["shared-photos"]}
            changeActive={clickHandler}
          >
            {/* Something else  */}
            {Array.from({ length: 6 }).map((_, i) => (
              <Photos key={i} />
            ))}
          </DropDown>

          <DropDown
            id="shared-files"
            text="Shared files"
            isActive={state["shared-files"]}
            changeActive={clickHandler}
          />
        </section>
      </div>

      <section className="detail-control">
        <button className="block" onClick={handleBlock}>
          {chatStore.isCurrentUserBlocked
            ? "You are blocked"
            : chatStore.isReciverBlocked
            ? "User blocked"
            : "Block user"}
        </button>
        <button onClick={logOutHandler} className="logout">
          Logout
        </button>
      </section>
    </aside>
  );
};

export default Details;
