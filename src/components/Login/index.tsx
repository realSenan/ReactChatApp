import React, { useState } from "react";
import User from "../../assets/user.png";
import { toast } from "react-toastify";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import upload from "../../lib/upload";

export interface ProfileState {
  file: File | null;
  url: string;
}

const Login = () => {
  const [profile, setProfile] = useState<ProfileState>({
    file: null,
    url: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const imageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setProfile({
        file: files[0],
        url: URL.createObjectURL(files[0]),
      });
    }
  };

  const loginHandler = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);

    try {
      await signInWithEmailAndPassword(
        auth,
        email as string,
        password as string
      );

      toast.success("Login successfly");
    } catch (err) {
      if (err instanceof Error) {
        console.error(err);
        toast.error(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const registerHandler = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.target);
    const { username, password, email } = Object.fromEntries(formData);

    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        email as string,
        password as string
      );

      const imgUrl = await upload(profile.file);

      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        id: res.user.uid,
        avatar: imgUrl,
        blocked: [],
      });

      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: [],
      });

      toast.success("Account created! You can login now!");
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
    <div className="auth-wrapper">
      <div className="login">
        <h2>Welcome back,</h2>

        <form onSubmit={loginHandler}>
          <input
            disabled={isLoading}
            type="text"
            name="email"
            placeholder="Email..."
          />
          <input
            disabled={isLoading}
            type="password"
            name="password"
            placeholder="Password..."
          />
          <button disabled={isLoading}>Sign in</button>
        </form>
      </div>
      <div className="seperator" />
      <div className="register">
        <h2>Create an Account</h2>

        <form onSubmit={registerHandler}>
          <label htmlFor="file" id="profile">
            <img src={profile.url || User} alt="" />
            <span>Upload an image</span>
            <input
              type="file"
              name="profile"
              id="file"
              onChange={imageHandler}
              disabled={isLoading}
            />
          </label>

          <input
            disabled={isLoading}
            type="text"
            name="username"
            placeholder="Username..."
          />
          <input
            disabled={isLoading}
            type="text"
            name="email"
            placeholder="Email..."
          />
          <input
            disabled={isLoading}
            type="password"
            name="password"
            placeholder="Password..."
          />

          <button disabled={isLoading}>Sign up</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
