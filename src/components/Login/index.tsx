import React, { useState } from "react";
import User from "../../assets/user.png";
import { toast } from "react-toastify";

const Login = () => {
  const [profile, setProfile] = useState("");

  const imageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setProfile(URL.createObjectURL(files[0]));
    }
  };

  const loginHandler = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Hello")
  };
  const registerHandler = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="auth-wrapper">
      <div className="login">
        <h2>Welcome back,</h2>

        <form onSubmit={loginHandler}>
          <input type="text" id="email" placeholder="Email..." />
          <input type="text" id="password" placeholder="Password..." />
          <button>Sign in</button>
        </form>
      </div>
      <div className="seperator" />
      <div className="register">
        <h2>Create an Account</h2>

        <form onSubmit={registerHandler}>
          <label htmlFor="file" id="profile">
            <img src={profile || User} alt="" />
            <span>Upload an image</span>
            <input
              type="file"
              name="profile"
              id="file"
              onChange={imageHandler}
            />
          </label>

          <input type="text" id="username" placeholder="Username..." />
          <input type="text" id="email" placeholder="Email..." />
          <input type="text" id="password" placeholder="Password..." />
          <button>Sign up</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
