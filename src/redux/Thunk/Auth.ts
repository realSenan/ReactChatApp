import { createAsyncThunk } from "@reduxjs/toolkit";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../../lib/firebase";
import { CurrentUserType } from "../authSlice";

export const login = createAsyncThunk(
  "auth/login",
  async (uid: string | undefined, { rejectWithValue }) => {
    try {
      if (uid) {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data(); // Kullanıcı verisi

          const currentUser: CurrentUserType = {
            avatar: userData.avatar || null,
            blocked: userData.blocked || [],
            email: userData.email || "",
            id: userData.id || "",
            username: userData.username || "",
          };

          return currentUser; // Kullanıcı verisini döndür
        }
      }

      return null;
    } catch (err) {
      if (err instanceof Error) {
        console.error(err);
        toast.error(err.message);
        return rejectWithValue(err.message);
      }
    }
  }
);
