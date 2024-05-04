import { BiSolidPhoneCall } from "react-icons/bi";
import { HiMiniVideoCamera } from "react-icons/hi2";
import { FaInfoCircle } from "react-icons/fa";
import userAvatar from "../../assets/user.png";
import { useSelector } from "react-redux";
import { CurrentUserType } from "../../redux/authSlice";

const Header = () => {
  const { user } = useSelector(
    ({ chatStore }: { chatStore: { user: CurrentUserType } }) => chatStore
  );

  console.log(user);

  return (
    <header>
      <figure>
        <img src={user.avatar || userAvatar} alt="" />

        <figcaption>
          <h2>{user.username}</h2>
          <h3>Here is a status...</h3>
        </figcaption>
      </figure>

      <div className="icons">
        <BiSolidPhoneCall size={22} />
        <HiMiniVideoCamera size={22} />
        <FaInfoCircle size={22} />
      </div>
    </header>
  );
};

export default Header;
