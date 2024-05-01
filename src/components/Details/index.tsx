import React, { useState } from "react";
import DropDown from "./DropDown";
import Photos from "./Photos";
import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useDispatch } from "react-redux";
import { logOut } from "../../redux/authSlice";
import { toast } from "react-toastify";
import user from "../../assets/user.png";

interface State {
  chat: boolean;
  privacy: boolean;
  "shared-photos": boolean;
  "shared-files": boolean;
}

const Details = () => {
  const dispatch = useDispatch();
  const [state, setState] = useState<State>({
    chat: false,
    privacy: false,
    "shared-photos": true,
    "shared-files": false,
  });

  const clickHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const id = e.currentTarget.id;
    setState((prev) => ({
      ...prev,
      [id]: !prev[id as keyof State],
    }));
  };

  const logOutHandler = () => {
    signOut(auth).then(() => {
      dispatch(logOut());
      toast.success("Logout success!");
    });
  };

  return (
    <aside className="details">
      <div>
        <figure className="sidebar-profile">
          <img
            id="profile"
            src={user}
            alt=""
          />

          <figcaption>
            <h2>Cilli Balam Elya</h2>
            <h3>Yatiram</h3>
          </figcaption>
        </figure>

        <section className="dropdown-container">
          <DropDown
            id="chat"
            text="Chat Settings"
            isActive={state.chat}
            changeActive={clickHandler}
          />
          <DropDown
            id="privacy"
            text="Privacy & help"
            isActive={state.privacy}
            changeActive={clickHandler}
          />
          <DropDown
            id="shared-photos"
            text="Shared photos"
            isActive={state["shared-photos"]}
            changeActive={clickHandler}
          >
            {/* Something else  */}
            {Array.from({ length: 6 }).map((_, i) => (
              <Photos key={i} />
            ))}
          </DropDown>

          <DropDown
            id="shared-files"
            text="Shared files"
            isActive={state["shared-files"]}
            changeActive={clickHandler}
          />
        </section>
      </div>

      <section className="detail-control">
        <button className="block">Block user</button>
        <button onClick={logOutHandler} className="logout">
          Logout
        </button>
      </section>
    </aside>
  );
};

export default Details;
