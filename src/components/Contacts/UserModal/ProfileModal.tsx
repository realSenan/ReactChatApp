import React, { useState } from "react";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { CurrentUserType, FriendRequestType } from "../../../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  changeChat,
  chatStpreType,
  setProfileModalUser,
} from "../../../redux/chatStore";
import { toast } from "react-toastify";
import Avatar from "../../Common/Avatar";

export const sendFriendRequest = async (
  currentUser: CurrentUserType,
  targetUserId: string
) => {
  if (currentUser.id === targetUserId) return;

  const targetRef = doc(db, "users", targetUserId);
  const currentRef = doc(db, "users", currentUser.id);

  const targetSnap = await getDoc(targetRef);
  if (!targetSnap.exists()) {
    toast.error("User not found.");
    return;
  }

  const targetData = targetSnap.data() as CurrentUserType;
  const existingReqs = targetData.friendRequests || [];
  if (existingReqs.some((r) => r.fromId === currentUser.id)) {
    toast.info("You have already sent a request to this user.");
    return;
  }

  const newRequest: FriendRequestType = {
    fromId: currentUser.id,
    fromName: currentUser.username,
    fromAvatar: currentUser.avatar || null,
    fromGender: currentUser.gender || "unspecified",
    createdAt: Date.now(),
  };

  await updateDoc(targetRef, {
    friendRequests: arrayUnion(newRequest),
  });

  await updateDoc(currentRef, {
    sentRequests: arrayUnion(targetUserId),
  });

  toast.success("Friend & message request sent!");
};

export const acceptFriendRequest = async (
  currentUser: CurrentUserType,
  request: FriendRequestType
) => {
  const currentRef = doc(db, "users", currentUser.id);
  const senderRef = doc(db, "users", request.fromId);

  const updatedRequests = (currentUser.friendRequests || []).filter(
    (r) => r.fromId !== request.fromId
  );

  await updateDoc(currentRef, {
    friendRequests: updatedRequests,
    friends: arrayUnion(request.fromId),
  });

  await updateDoc(senderRef, {
    sentRequests: arrayRemove(currentUser.id),
    friends: arrayUnion(currentUser.id),
  });

  // Ensure a 1-on-1 chat exists in userchats for both users
  const currentUserChatsRef = doc(db, "userchats", currentUser.id);
  const senderUserChatsRef = doc(db, "userchats", request.fromId);

  const currentChatsSnap = await getDoc(currentUserChatsRef);
  const existingChats = currentChatsSnap.exists()
    ? currentChatsSnap.data().chats || []
    : [];

  const existingChat = existingChats.find(
    (c: { reciverId: string }) => c.reciverId === request.fromId
  );

  let chatId = existingChat?.chatId;

  if (!chatId) {
    const newChatRef = doc(collection(db, "chats"));
    chatId = newChatRef.id;

    await setDoc(newChatRef, {
      createdAt: serverTimestamp(),
      messages: [],
    });

    const now = Date.now();

    const senderChatsSnap = await getDoc(senderUserChatsRef);
    if (!senderChatsSnap.exists()) {
      await setDoc(senderUserChatsRef, { chats: [] });
    }
    if (!currentChatsSnap.exists()) {
      await setDoc(currentUserChatsRef, { chats: [] });
    }

    await updateDoc(senderUserChatsRef, {
      chats: arrayUnion({
        chatId,
        lastMessage: "Friend request accepted 👋",
        reciverId: currentUser.id,
        isSeen: false,
        updatedAt: now,
      }),
    });

    await updateDoc(currentUserChatsRef, {
      chats: arrayUnion({
        chatId,
        lastMessage: "Friend request accepted 👋",
        reciverId: request.fromId,
        isSeen: true,
        updatedAt: now,
      }),
    });
  }

  toast.success(`You are now friends with ${request.fromName}!`);
  return chatId;
};

export const rejectFriendRequest = async (
  currentUser: CurrentUserType,
  request: FriendRequestType
) => {
  const currentRef = doc(db, "users", currentUser.id);
  const senderRef = doc(db, "users", request.fromId);

  const updatedRequests = (currentUser.friendRequests || []).filter(
    (r) => r.fromId !== request.fromId
  );

  await updateDoc(currentRef, {
    friendRequests: updatedRequests,
  });

  await updateDoc(senderRef, {
    sentRequests: arrayRemove(currentUser.id),
  });

  toast.info("Friend request declined.");
};

const ProfileModal: React.FC = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const { profileModalUser } = useSelector(
    ({ chatStore }: { chatStore: chatStpreType }) => chatStore
  );
  const { currentUser } = useSelector(
    ({ auth }: { auth: { currentUser: CurrentUserType } }) => auth
  );

  if (!profileModalUser || !currentUser) return null;

  const close = () => {
    dispatch(setProfileModalUser(null));
  };

  const stopClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const isBlocked = currentUser.blocked?.includes(profileModalUser.id);
  const isFriend = currentUser.friends?.includes(profileModalUser.id);
  const isRequestSent = currentUser.sentRequests?.includes(profileModalUser.id);
  const incomingRequest = currentUser.friendRequests?.find(
    (r) => r.fromId === profileModalUser.id
  );

  const handleSendRequest = async () => {
    setLoading(true);
    try {
      await sendFriendRequest(currentUser, profileModalUser.id);
    } catch (err) {
      if (err instanceof Error) toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async () => {
    if (!incomingRequest) return;
    setLoading(true);
    try {
      const chatId = await acceptFriendRequest(currentUser, incomingRequest);
      const userSnap = await getDoc(doc(db, "users", profileModalUser.id));
      if (userSnap.exists() && chatId) {
        dispatch(
          changeChat({
            chatId,
            user: userSnap.data() as CurrentUserType,
            currentUser,
          })
        );
      }
      close();
    } catch (err) {
      if (err instanceof Error) toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPrivateChat = async () => {
    setLoading(true);
    try {
      const userChatsRef = doc(db, "userchats", currentUser.id);
      const snap = await getDoc(userChatsRef);
      const chats = snap.exists() ? snap.data().chats || [] : [];
      const found = chats.find(
        (c: { reciverId: string }) => c.reciverId === profileModalUser.id
      );

      const targetSnap = await getDoc(doc(db, "users", profileModalUser.id));
      const freshTarget = targetSnap.exists()
        ? (targetSnap.data() as CurrentUserType)
        : profileModalUser;

      if (found) {
        dispatch(
          changeChat({
            chatId: found.chatId,
            user: freshTarget,
            currentUser,
          })
        );
        close();
      } else {
        const chatId = await acceptFriendRequest(currentUser, {
          fromId: profileModalUser.id,
          fromName: profileModalUser.username,
          fromAvatar: profileModalUser.avatar,
          fromGender: profileModalUser.gender || "unspecified",
          createdAt: Date.now(),
        });
        if (chatId) {
          dispatch(
            changeChat({
              chatId,
              user: freshTarget,
              currentUser,
            })
          );
          close();
        }
      }
    } catch (err) {
      if (err instanceof Error) toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async () => {
    setLoading(true);
    try {
      const userDocRef = doc(db, "users", currentUser.id);
      await updateDoc(userDocRef, {
        blocked: isBlocked
          ? arrayRemove(profileModalUser.id)
          : arrayUnion(profileModalUser.id),
      });
      toast.info(
        isBlocked
          ? `Unblocked ${profileModalUser.username}.`
          : `Blocked ${profileModalUser.username}.`
      );
    } catch (err) {
      if (err instanceof Error) toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div onClick={close} className="find-user-modal">
      <div onClick={stopClick} className="inner-user-modal profile-modal-card">
        <div className="profile-modal-header">
          <Avatar
            src={profileModalUser.avatar}
            gender={profileModalUser.gender}
            alt={profileModalUser.username}
          />
          <h2>{profileModalUser.username}</h2>
          {profileModalUser.email && <p>{profileModalUser.email}</p>}
        </div>

        <div className="profile-modal-actions">
          {!isBlocked && (
            <>
              {isFriend ? (
                <button
                  className="btn-primary"
                  disabled={loading}
                  onClick={handleOpenPrivateChat}
                >
                  Send Private Message
                </button>
              ) : incomingRequest ? (
                <button
                  className="btn-success"
                  disabled={loading}
                  onClick={handleAcceptRequest}
                >
                  Accept Friend Request
                </button>
              ) : isRequestSent ? (
                <button className="btn-disabled" disabled>
                  Request Sent (Pending)
                </button>
              ) : (
                <button
                  className="btn-primary"
                  disabled={loading}
                  onClick={handleSendRequest}
                >
                  Add Friend &amp; Send Request
                </button>
              )}
            </>
          )}

          <button
            className={`btn-block ${isBlocked ? "unblock" : ""}`}
            disabled={loading}
            onClick={handleToggleBlock}
          >
            {isBlocked ? "Unblock User" : "Block User"}
          </button>

          <button className="btn-close" onClick={close}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;

