import DropDown from "./DropDown";
import { db } from "../../lib/firebase";
import { useDispatch, useSelector } from "react-redux";
import { CurrentUserType } from "../../redux/authSlice";
import { toast } from "react-toastify";
import {
  changeBlock,
  chatStpreType,
  closeDetails,
} from "../../redux/chatStore";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { RiEyeCloseFill } from "react-icons/ri";
import { FaGlobeAmericas } from "react-icons/fa";
import { GLOBAL_CHAT_ID } from "../../redux/Thunk/Auth";
import Avatar from "../Common/Avatar";

const Details = () => {
  const dispatch = useDispatch();

  const chatStore = useSelector(
    ({ chatStore }: { chatStore: chatStpreType }) => chatStore
  );

  const { currentUser } = useSelector(
    ({ auth }: { auth: { currentUser: CurrentUserType } }) => auth
  );

  const isGlobal = chatStore.chatId === GLOBAL_CHAT_ID;

  const handleBlock = async () => {
    if (!chatStore.user) return;
    const userDocRef = doc(db, "users", currentUser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: chatStore.isReciverBlocked
          ? arrayRemove(chatStore.user.id)
          : arrayUnion(chatStore.user.id),
      });
      dispatch(changeBlock());
    } catch (er) {
      if (er instanceof Error) {
        toast.error(er.message);
      }
    }
  };

  const clickUnsupported = () => {
    toast.warning("Unsupported feature at the moment");
  };

  const { isDetailsClose } = useSelector(
    ({ chatStore }: { chatStore: chatStpreType }) => chatStore
  );

  const handleDetails = () => {
    dispatch(closeDetails());
  };

  return (
    <aside className={`details ${isDetailsClose ? "active" : ""}`}>
      <div className="close-icon" onClick={handleDetails}>
        <RiEyeCloseFill size={20} />
      </div>

      <div>
        <figure className="sidebar-profile">
          {isGlobal ? (
            <div className="global-avatar details-global-avatar">
              <FaGlobeAmericas size={44} />
            </div>
          ) : (
            <Avatar
              id="profile"
              src={chatStore.user?.avatar}
              gender={chatStore.user?.gender}
              alt={chatStore.user?.username || "User"}
            />
          )}

          <figcaption>
            <h2>{isGlobal ? "Global Chat" : chatStore.user?.username}</h2>
            <h3>
              {isGlobal
                ? "Public Chat Room"
                : chatStore.user?.email || "User"}
            </h3>
          </figcaption>
        </figure>

        <section className="dropdown-container">
          <DropDown
            id="chat"
            text="Chat Settings"
            isActive={false}
            changeActive={clickUnsupported}
          />
          <DropDown
            id="privacy"
            text="Privacy & help"
            isActive={false}
            changeActive={clickUnsupported}
          />
          <DropDown
            id="shared-photos"
            text="Shared photos"
            isActive={false}
            changeActive={clickUnsupported}
          />
          <DropDown
            id="shared-files"
            text="Shared files"
            isActive={false}
            changeActive={clickUnsupported}
          />
        </section>
      </div>

      <section className="detail-control">
        {!isGlobal && chatStore.user && (
          <button className="block" onClick={handleBlock}>
            {chatStore.isCurrentUserBlocked
              ? "You are blocked"
              : chatStore.isReciverBlocked
              ? "Unblock User"
              : "Block User"}
          </button>
        )}
      </section>
    </aside>
  );
};

export default Details;


