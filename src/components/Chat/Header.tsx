import { BiSolidPhoneCall } from "react-icons/bi";
import { HiMiniVideoCamera } from "react-icons/hi2";
import { FaInfoCircle } from "react-icons/fa";

const Header = () => {
  return (
    <header>
      <figure>
        <img
          src="https://img.freepik.com/free-photo/medium-shot-anime-woman-hugging-cat_23-2150970701.jpg?t=st=1713690312~exp=1713693912~hmac=88027b88800dadfbce6a64fd90fd4eb35d488fccde34889e93ca9ebb40fa5392&w=996"
          alt=""
        />

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
