import React, { useState } from "react";
import DropDown from "./DropDown";
import Photos from "./Photos";

interface State {
  chat: boolean;
  privacy: boolean;
  "shared-photos": boolean;
  "shared-files": boolean;
}

const Details = () => {
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

  return (
    <aside className="details">
      <div>
        <figure className="sidebar-profile">
          <img
            id="profile"
            src="https://img.freepik.com/free-photo/medium-shot-anime-woman-hugging-cat_23-2150970701.jpg?t=st=1713690312~exp=1713693912~hmac=88027b88800dadfbce6a64fd90fd4eb35d488fccde34889e93ca9ebb40fa5392&w=996"
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
            {Array.from({ length: 6 }).map(() => (
              <Photos />
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
        <button className="logout">Logout</button>
      </section>
    </aside>
  );
};

export default Details;
