import User from "../../assets/user.png";

const Login = () => {
  return (
    <div className="auth-wrapper">
      <div className="login">
        <h2>Welcome back,</h2>

        <form>
          <input type="text" id="email" />
          <input type="text" id="password" />
        </form>
      </div>
      <div className="seperator"/>
      <div className="register">
        <h2>Create an Account</h2>

        <form>
          <label htmlFor="file" id="profile">
            <img src={User} alt="" />
            <span>Upload an image</span>
            <input type="file" name="profile" id="file" />
          </label>

          <input type="text" id="username" />
          <input type="text" id="email" />
          <input type="text" id="password" />
        </form>
      </div>
    </div>
  );
};

export default Login;
