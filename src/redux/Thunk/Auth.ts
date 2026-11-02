import { createAsyncThunk } from "@reduxjs/toolkit";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { auth, db } from "../../lib/firebase";
import { CurrentUserType } from "../authSlice";

export const GLOBAL_CHAT_ID = "global_chat";

export const ensureGlobalChatExists = async () => {
  try {
    const globalRef = doc(db, "chats", GLOBAL_CHAT_ID);
    const globalSnap = await getDoc(globalRef);
    if (!globalSnap.exists()) {
      await setDoc(globalRef, {
        createdAt: serverTimestamp(),
        messages: [],
        isGlobal: true,
      });
    }
  } catch (err) {
    console.error("Global chat init error:", err);
  }
};

export const login = createAsyncThunk(
  "auth/login",
  async (uid: string | undefined, { rejectWithValue }) => {
    try {
      if (uid) {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        await ensureGlobalChatExists();

        if (docSnap.exists()) {
          const userData = docSnap.data();

          const currentUser: CurrentUserType = {
            avatar: userData.avatar || null,
            gender: userData.gender || "unspecified",
            blocked: userData.blocked || [],
            email: userData.email || "",
            id: userData.id || uid,
            username: userData.username || "User",
            friends: userData.friends || [],
            friendRequests: userData.friendRequests || [],
            sentRequests: userData.sentRequests || [],
          };

          return currentUser;
        } else if (auth.currentUser && auth.currentUser.uid === uid) {
          const fbUser = auth.currentUser;
          const newUser: CurrentUserType = {
            id: fbUser.uid,
            username:
              fbUser.displayName ||
              fbUser.email?.split("@")[0] ||
              "User",
            email: fbUser.email || "",
            avatar: fbUser.photoURL || null,
            gender: "unspecified",
            blocked: [],
            friends: [],
            friendRequests: [],
            sentRequests: [],
          };

          await setDoc(docRef, newUser);
          const userChatsRef = doc(db, "userchats", fbUser.uid);
          const userChatsSnap = await getDoc(userChatsRef);
          if (!userChatsSnap.exists()) {
            await setDoc(userChatsRef, { chats: [] });
          }

          return newUser;
        }
      }

      return null;
    } catch (err) {
      if (err instanceof Error) {
        console.error(err);
        toast.error(err.message);
        return rejectWithValue(err.message);
      }
      return null;
    }
  }
);

