import { useState } from "react";
import { toast } from "react-toastify";
import { signInWithPopup } from "firebase/auth";
import { auth, db, googleProvider } from "../../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { FcGoogle } from "react-icons/fc";
import { store } from "../../redux/store";
import { ensureGlobalChatExists, login } from "../../redux/Thunk/Auth";

export interface ProfileState {
  file: File | null;
  url: string;
}

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);

  const googleLoginHandler = async () => {
    setIsLoading(true);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
          username:
            user.displayName || user.email?.split("@")[0] || "User",
          email: user.email || "",
          id: user.uid,
          avatar: user.photoURL || null,
          gender: "unspecified",
          blocked: [],
          friends: [],
          friendRequests: [],
          sentRequests: [],
        });

        await setDoc(doc(db, "userchats", user.uid), {
          chats: [],
        });
      }

      await ensureGlobalChatExists();
      await store.dispatch(login(user.uid));
      toast.success("Successfully signed in with Google!");
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-wrapper google-only">
      <div className="login google-login-box">
        <h2>Welcome</h2>
        <p className="login-subtitle">
          Sign in with your Google account to join the Global Chat and connect
          with friends.
        </p>

        <button
          type="button"
          className="google-login-btn"
          disabled={isLoading}
          onClick={googleLoginHandler}
        >
          <FcGoogle size={24} />
          <span>{isLoading ? "Signing in..." : "Sign in with Google"}</span>
        </button>
      </div>
    </div>
  );
};

export default Login;

