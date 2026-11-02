import React, { useEffect, useRef, useState } from "react";
import { IoCheckmarkSharp } from "react-icons/io5";
import { Message, SeenUser } from "./ChatArea";
import { useDispatch, useSelector } from "react-redux";
import { CurrentUserType } from "../../redux/authSlice";
import { chatStpreType, setProfileModalUser } from "../../redux/chatStore";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import Avatar from "../Common/Avatar";

interface Props {
  chat: Message;
}

const UserMessage: React.FC<Props> = ({ chat }) => {
  const dispatch = useDispatch();
  const [showSeenPopup, setShowSeenPopup] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { currentUser } = useSelector(
    ({ auth }: { auth: { currentUser: CurrentUserType } }) => auth
  );

  const chatInfo = useSelector(
    ({ chatStore }: { chatStore: chatStpreType }) => chatStore
  );

  const isOwn = currentUser.id === chat.senderId;
  const isSenderBlocked = currentUser.blocked?.includes(chat.senderId);

  const displayAvatar =
    chat.senderAvatar !== undefined
      ? chat.senderAvatar
      : chatInfo.user?.avatar || null;
  const displayGender =
    chat.senderGender || chatInfo.user?.gender || "unspecified";
  const displayName = chat.senderName || chatInfo.user?.username || "User";

  const seenUsers = (chat.seenBy || []).filter((u) => u.id !== chat.senderId);
  const isSeenByAnyone = seenUsers.length > 0;

  const handleMouseEnter = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    setShowSeenPopup(true);
  };

  const handleMouseLeave = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
    hideTimerRef.current = setTimeout(() => {
      setShowSeenPopup(false);
    }, 180);
  };

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  const openUserProfileById = async (
    targetId: string,
    fallbackName: string,
    fallbackAvatar: string | null,
    fallbackGender?: string,
    fallbackEmail?: string
  ) => {
    if (targetId === currentUser.id) return;
    try {
      const userSnap = await getDoc(doc(db, "users", targetId));
      if (userSnap.exists()) {
        dispatch(setProfileModalUser(userSnap.data() as CurrentUserType));
      } else {
        dispatch(
          setProfileModalUser({
            id: targetId,
            username: fallbackName,
            avatar: fallbackAvatar,
            gender: fallbackGender || "unspecified",
            email: fallbackEmail || "",
            blocked: [],
          })
        );
      }
    } catch {
      dispatch(
        setProfileModalUser({
          id: targetId,
          username: fallbackName,
          avatar: fallbackAvatar,
          gender: fallbackGender || "unspecified",
          email: fallbackEmail || "",
          blocked: [],
        })
      );
    }
  };

  const handleOpenSenderProfile = () => {
    if (isOwn) return;
    openUserProfileById(
      chat.senderId,
      displayName,
      displayAvatar,
      displayGender,
      chat.senderEmail
    );
  };

  const handleOpenSeenUserProfile = (u: SeenUser) => {
    setShowSeenPopup(false);
    openUserProfileById(u.id, u.username, u.avatar, u.gender);
  };

  return (
    <div className={`message ${showSeenPopup ? "popup-open" : ""}`}>
      <div className="text-wrapper">
        {!isOwn ? (
          <Avatar
            id="profile"
            src={displayAvatar}
            gender={displayGender}
            alt={displayName}
            style={{ cursor: "pointer" }}
            title={`View ${displayName}'s profile`}
            onClick={handleOpenSenderProfile}
          />
        ) : null}
        <div className="text-main">
          {!isOwn && (
            <span
              className="sender-name"
              onClick={handleOpenSenderProfile}
              title="Click to view profile & add friend"
            >
              {displayName}
            </span>
          )}

          {/* Hover target wrapping the message bubble AND the seen tooltip directly */}
          <div
            className="message-bubble-hover-area"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className={`text ${isOwn ? "own" : ""} ${
                isSenderBlocked ? "blocked-message" : ""
              }`}
            >
              <span className="msg-text-content">
                {isSenderBlocked ? "🚫 Blocked user's message" : chat.text}
              </span>

              {isOwn && (
                <div className={`seen ${isSeenByAnyone ? "seen-active" : ""}`}>
                  <IoCheckmarkSharp size={15} />
                  {isSeenByAnyone && <IoCheckmarkSharp size={15} />}
                </div>
              )}
            </div>

            <div
              className={`seen-tooltip-bridge ${
                isOwn ? "own-tooltip" : "other-tooltip"
              } ${showSeenPopup ? "visible" : ""}`}
            >
              <div className="seen-tooltip-box">
                {isSeenByAnyone ? (
                  <>
                    <div className="seen-tooltip-title">
                      Seen by ({seenUsers.length})
                    </div>
                    <div className="seen-users-list">
                      {seenUsers.map((u) => (
                        <div
                          key={u.id}
                          className={`seen-user-chip ${
                            u.id !== currentUser.id ? "clickable" : ""
                          }`}
                          onClick={() => handleOpenSeenUserProfile(u)}
                          title={
                            u.id !== currentUser.id
                              ? `Click to view ${u.username}'s profile`
                              : "You"
                          }
                        >
                          <Avatar
                            src={u.avatar}
                            gender={u.gender}
                            alt={u.username}
                          />
                          <span>
                            {u.username}
                            {u.id === currentUser.id ? " (You)" : ""}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="seen-tooltip-empty">
                    Not seen by anyone yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserMessage;



