import { BiSolidPhoneCall } from "react-icons/bi";
import { HiMiniVideoCamera } from "react-icons/hi2";
import { FaInfoCircle, FaGlobeAmericas } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  chatStpreType,
  closeDetails,
  setProfileModalUser,
} from "../../redux/chatStore";
import { GLOBAL_CHAT_ID } from "../../redux/Thunk/Auth";
import { toast } from "react-toastify";
import Avatar from "../Common/Avatar";

const Header = () => {
  const { user, chatId } = useSelector(
    ({ chatStore }: { chatStore: chatStpreType }) => chatStore
  );
  const dispatch = useDispatch();

  const handleDetails = () => {
    dispatch(closeDetails());
  };

  const handleUnsupported = () => {
    toast.warning("Unsupported feature at the moment");
  };

  const isGlobal = chatId === GLOBAL_CHAT_ID;

  return (
    <header>
      <figure
        style={{ cursor: !isGlobal && user ? "pointer" : "default" }}
        onClick={() => {
          if (!isGlobal && user) {
            dispatch(setProfileModalUser(user));
          }
        }}
      >
        {isGlobal ? (
          <div className="global-avatar header-global-avatar">
            <FaGlobeAmericas size={30} />
          </div>
        ) : (
          <Avatar
            src={user?.avatar}
            gender={user?.gender}
            alt={user?.username || "User"}
          />
        )}

        <figcaption>
          <h2>{isGlobal ? "Global Chat" : user?.username}</h2>
          <h3>
            {isGlobal
              ? "Click on user profiles to add friends or send message requests"
              : user?.email || "Online"}
          </h3>
        </figcaption>
      </figure>

      <div className="icons">
        <BiSolidPhoneCall
          size={22}
          style={{ cursor: "pointer" }}
          onClick={handleUnsupported}
          title="Unsupported feature at the moment"
        />
        <HiMiniVideoCamera
          size={22}
          style={{ cursor: "pointer" }}
          onClick={handleUnsupported}
          title="Unsupported feature at the moment"
        />
        <FaInfoCircle
          size={22}
          style={{ cursor: "pointer" }}
          onClick={handleDetails}
          title="Chat Info"
        />
      </div>
    </header>
  );
};

export default Header;


