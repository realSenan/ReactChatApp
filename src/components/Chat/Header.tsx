import { BiSolidPhoneCall } from "react-icons/bi";
import { HiMiniVideoCamera } from "react-icons/hi2";
import { FaInfoCircle } from "react-icons/fa";
import user from "../../assets/user.png";

const Header = () => {
  return (
    <header>
      <figure>
        <img src={user} alt="" />

        <figcaption>
          <h2>Cilli Balam Elya</h2>
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
