import { createAsyncThunk } from "@reduxjs/toolkit";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../../lib/firebase";

export const login = createAsyncThunk(
  "auth/login",
  async (uid: string, { rejectWithValue }) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data(); // Kullanıcı verisi
        return userData; // Kullanıcı verisini döndür
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
