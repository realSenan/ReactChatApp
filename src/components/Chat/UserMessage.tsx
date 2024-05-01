import React from "react";
import { IoCheckmarkSharp } from "react-icons/io5";
import user from "../../assets/user.png";

interface Props {
  own?: boolean;
}

const UserMessage: React.FC<Props> = ({ own }) => {
  return (
    <div className="message">
      <div className="text-wrapper">
        {!own ? (
          <img
            id="profile"
            src={user}
          />
        ) : null}

        <div>
          <div className={`text ${own ? "own" : ""}`}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi, a in
            corporis numquam vel minus earum nisi eos reiciendis aspernatur
            animi suscipit aut delectus consectetur reprehenderit itaque.
            Placeat, voluptatem error. Lorem ipsum dolor sit, amet consectetur
            adipisicing elit. Architecto, eaque tenetur porro ipsa provident at
            est dolores iure, nam officia
            <div className="seen">
              <IoCheckmarkSharp />
              <IoCheckmarkSharp />
            </div>
          </div>
          <div className="time">1 min ago</div>
        </div>
      </div>
    </div>
  );
};

export default UserMessage;
