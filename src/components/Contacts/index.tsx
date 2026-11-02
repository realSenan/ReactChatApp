import { BsThreeDots } from "react-icons/bs";
import { HiMiniVideoCamera } from "react-icons/hi2";
import { TbEdit } from "react-icons/tb";
import { IoMdSearch } from "react-icons/io";
import { HiPlus } from "react-icons/hi";
import { FaGlobeAmericas } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import { MdOutlineRemove } from "react-icons/md";
import FindUser from "./UserModal/FindUser";
import EditProfileModal from "./UserModal/EditProfileModal";
import ProfileModal, {
  acceptFriendRequest,
  rejectFriendRequest,
} from "./UserModal/ProfileModal";
import { useDispatch, useSelector } from "react-redux";
import {
  CurrentUserType,
  FriendRequestType,
  logOut,
} from "../../redux/authSlice";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import { signOut } from "firebase/auth";
import User, { ChatDataType, UserType } from "./User";
import { changeChat, chatStpreType, closeContact } from "../../redux/chatStore";
import { GLOBAL_CHAT_ID } from "../../redux/Thunk/Auth";
import { toast } from "react-toastify";
import Avatar from "../Common/Avatar";

const Contacts = () => {
  const [isAdd, setIsAdd] = useState(false);
  const [isEditProfile, setIsEditProfile] = useState(false);
  const [showDotsMenu, setShowDotsMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [chats, setChats] = useState<Array<ChatDataType>>([]);
  const [globalLastMsg, setGlobalLastMsg] = useState<string>(
    "Public chat room for everyone"
  );
  const [globalUnreadCount, setGlobalUnreadCount] = useState<number>(0);

  const dotsMenuRef = useRef<HTMLDivElement>(null);

  const { currentUser }: { currentUser: CurrentUserType } = useSelector(
    (state: { auth: { currentUser: CurrentUserType } }) => state.auth
  );

  const unsupportedFeature = () => {
    toast.warning("Unsupported feature at the moment");
  };

  useEffect(() => {
    if (!currentUser?.id) return;

    const unsubGlobal = onSnapshot(doc(db, "chats", GLOBAL_CHAT_ID), (snap) => {
      if (!snap.exists()) return;
      const msgs = snap.data()?.messages || [];
      if (msgs.length === 0) {
        setGlobalLastMsg("No messages yet");
        setGlobalUnreadCount(0);
        return;
      }

      // Compute unread messages in Global Chat
      let unread = 0;
      for (const m of msgs) {
        if (
          m.senderId !== currentUser.id &&
          !currentUser.blocked?.includes(m.senderId)
        ) {
          const seenList = m.seenBy || [];
          const hasSeen = seenList.some(
            (u: { id: string }) => u.id === currentUser.id
          );
          if (!hasSeen) unread++;
        }
      }
      setGlobalUnreadCount(unread);

      // Compute last message preview for Global Chat
      const last = msgs[msgs.length - 1];
      if (currentUser.blocked?.includes(last.senderId)) {
        setGlobalLastMsg("🚫 Blocked user's message");
      } else if (last.senderId === currentUser.id) {
        setGlobalLastMsg(`You: ${last.text}`);
      } else {
        setGlobalLastMsg(`${last.senderName || "User"}: ${last.text}`);
      }
    });

    return () => {
      unsubGlobal();
    };
  }, [currentUser?.id, currentUser?.blocked]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        dotsMenuRef.current &&
        !dotsMenuRef.current.contains(e.target as Node)
      ) {
        setShowDotsMenu(false);
      }
    };
    if (showDotsMenu) {
      window.addEventListener("click", handleOutsideClick);
    }
    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [showDotsMenu]);

  useEffect(() => {
    if (!currentUser?.id) return;

    const unSub = onSnapshot(
      doc(db, "userchats", currentUser.id),
      async (res) => {
        const chatList: UserType[] = res.data()?.chats || [];

        const promises = chatList.map(async (item: UserType) => {
          const userDocRef = doc(db, "users", item.reciverId);
          const userDocSnap = await getDoc(userDocRef);
          const userData = userDocSnap.data() as CurrentUserType | undefined;

          return {
            chatItem: item,
            chatList,
            user: userData || {
              id: item.reciverId,
              username: "User",
              email: "",
              avatar: null,
              gender: "unspecified",
              blocked: [],
            },
          };
        });

        const chatData = await Promise.all(promises);

        setChats(
          chatData.sort(
            (a, b) =>
              (b.chatItem.updatedAt || b.chatItem.updatedAd || 0) -
              (a.chatItem.updatedAt || a.chatItem.updatedAd || 0)
          )
        );
      }
    );

    return () => {
      unSub();
    };
  }, [currentUser?.id]);

  const addHandler = () => {
    setIsAdd((prev) => !prev);
  };
  const [searchName, setSearchName] = useState("");
  const filterChats = chats.filter((c) => {
    if (currentUser?.blocked?.includes(c.user?.id)) return false;
    return (c.user?.username || "")
      .toLowerCase()
      .includes(searchName.toLowerCase());
  });

  const { isContactClose, chatId } = useSelector(
    ({ chatStore }: { chatStore: chatStpreType }) => chatStore
  );

  const contactRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();

  const selectGlobalChat = () => {
    dispatch(
      changeChat({
        chatId: GLOBAL_CHAT_ID,
        user: null,
        currentUser,
      })
    );
    if (window.innerWidth <= 925 && isContactClose) {
      dispatch(closeContact());
    }
  };

  const handleAccept = async (req: FriendRequestType) => {
    try {
      const newChatId = await acceptFriendRequest(currentUser, req);
      const userSnap = await getDoc(doc(db, "users", req.fromId));
      if (userSnap.exists() && newChatId) {
        dispatch(
          changeChat({
            chatId: newChatId,
            user: userSnap.data() as CurrentUserType,
            currentUser,
          })
        );
      }
    } catch (err) {
      if (err instanceof Error) toast.error(err.message);
    }
  };

  const handleReject = async (req: FriendRequestType) => {
    try {
      await rejectFriendRequest(currentUser, req);
    } catch (err) {
      if (err instanceof Error) toast.error(err.message);
    }
  };

  const confirmLogoutHandler = () => {
    signOut(auth).then(() => {
      dispatch(logOut());
      setShowLogoutConfirm(false);
      toast.success("Logged out successfully!");
    });
  };

  const incomingRequests = (currentUser?.friendRequests || []).filter(
    (req) => !currentUser?.blocked?.includes(req.fromId)
  );

  return (
    <aside
      ref={contactRef}
      className={`contact ${
        chatId ? (isContactClose ? "active" : "") : "isEmpty"
      }`}
    >
      <div className="control">
        <div className="user">
          <Avatar
            src={currentUser?.avatar}
            gender={currentUser?.gender}
            alt={currentUser?.username}
          />
          <h2 className="line-1-column">{currentUser?.username}</h2>
        </div>

        <div className="icons">
          <div className="dots-menu-wrapper" ref={dotsMenuRef}>
            <BsThreeDots
              size={20}
              style={{ cursor: "pointer" }}
              onClick={() => setShowDotsMenu((prev) => !prev)}
              title="More options"
            />
            {showDotsMenu && (
              <div className="dots-dropdown-menu">
                <button
                  type="button"
                  onClick={() => {
                    setShowDotsMenu(false);
                    setShowLogoutConfirm(true);
                  }}
                >
                  <FiLogOut size={16} />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>

          <HiMiniVideoCamera
            size={20}
            style={{ cursor: "pointer" }}
            onClick={unsupportedFeature}
            title="Unsupported feature at the moment"
          />
          <TbEdit
            size={20}
            style={{ cursor: "pointer" }}
            onClick={() => setIsEditProfile(true)}
            title="Edit Profile"
          />
        </div>
      </div>

      <div className="search">
        <label htmlFor="search-user" className="search-wrapper">
          <IoMdSearch size={20} id="search-icon" />
          <input
            type="text"
            id="search-user"
            placeholder="Search contacts..."
            onChange={(e) => setSearchName(e.target.value)}
          />
        </label>

        <button
          className="add-contact"
          onClick={addHandler}
          title="Find & Add Friends"
        >
          {isAdd ? <MdOutlineRemove size={22} /> : <HiPlus size={20} />}
        </button>
      </div>

      {incomingRequests.length > 0 && (
        <div className="friend-requests-box">
          <h4>Friend Requests ({incomingRequests.length})</h4>
          {incomingRequests.map((req) => (
            <div key={req.fromId} className="friend-request-item">
              <div className="req-user-info">
                <Avatar
                  src={req.fromAvatar}
                  gender={req.fromGender}
                  alt={req.fromName}
                />
                <span className="line-1-column">{req.fromName}</span>
              </div>
              <div className="req-actions">
                <button
                  className="accept-btn"
                  onClick={() => handleAccept(req)}
                >
                  Accept
                </button>
                <button
                  className="reject-btn"
                  onClick={() => handleReject(req)}
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="user-wrapper">
        {/* Pinned Global Chat */}
        <figure
          onClick={selectGlobalChat}
          className={`user-left-prev global-chat-item ${
            chatId === GLOBAL_CHAT_ID ? "active-chat" : ""
          } ${
            chatId !== GLOBAL_CHAT_ID && globalUnreadCount > 0
              ? "unread-chat"
              : ""
          }`}
        >
          <div className="global-avatar">
            <FaGlobeAmericas size={26} />
          </div>
          <figcaption className="contact-item-caption">
            <div className="contact-item-top">
              <h2 className="line-1-column">Global Chat</h2>
              {chatId !== GLOBAL_CHAT_ID && globalUnreadCount > 0 && (
                <span className="unread-badge">{globalUnreadCount}</span>
              )}
            </div>
            <h3 className="line-1-column">{globalLastMsg}</h3>
          </figcaption>
        </figure>

        {filterChats.map((chatUser: ChatDataType, i: number) => (
          <User
            chatData={chats}
            user={chatUser}
            key={chatUser.chatItem.chatId || i}
            index={i}
          />
        ))}
      </div>

      {isAdd ? <FindUser close={addHandler} /> : null}
      {isEditProfile ? (
        <EditProfileModal close={() => setIsEditProfile(false)} />
      ) : null}
      <ProfileModal />

      {showLogoutConfirm && (
        <div
          onClick={() => setShowLogoutConfirm(false)}
          className="find-user-modal"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="inner-user-modal profile-modal-card"
          >
            <h2 style={{ marginBottom: "10px" }}>Log Out</h2>
            <p style={{ color: "#cbd5e1", marginBottom: "22px" }}>
              Are you sure you want to log out of your account?
            </p>
            <div className="profile-modal-actions">
              <button className="btn-block" onClick={confirmLogoutHandler}>
                Yes, Log Out
              </button>
              <button
                className="btn-close"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Contacts;


