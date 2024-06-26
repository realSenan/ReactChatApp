import { BsThreeDots } from "react-icons/bs";
import { HiMiniVideoCamera } from "react-icons/hi2";
import { TbEdit } from "react-icons/tb";
import { IoMdSearch } from "react-icons/io";
import { HiPlus } from "react-icons/hi";
import { useEffect, useRef, useState } from "react";
import { MdOutlineRemove } from "react-icons/md";
import FindUser from "./UserModal/FindUser";
import { useDispatch, useSelector } from "react-redux";
import { CurrentUserType } from "../../redux/authSlice";
import user from "../../assets/user.png";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../lib/firebase";
import User, { ChatDataType } from "./User";
import { chatStpreType, closeContact } from "../../redux/chatStore";

const Contacts = () => {
  const [isAdd, setIsAdd] = useState(false);
  const [chats, setChats] = useState<Array<ChatDataType>>([]);

  const { currentUser }: { currentUser: CurrentUserType } = useSelector(
    (state: { auth: { currentUser: CurrentUserType } }) => state.auth
  );

  useEffect(() => {
    const unSub = onSnapshot(
      doc(db, "userchats", currentUser.id),
      async (res) => {
        const chatList = res.data()?.chats;

        const promises = chatList?.map(async (item: { reciverId: string }) => {
          const userDocRef = doc(db, "users", item.reciverId);
          const userDocSnap = await getDoc(userDocRef);
          const user = userDocSnap.data();

          return { chatList: { ...chatList }, user };
        });

        const chatData = await Promise.all(promises);

        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      }
    );

    return () => {
      unSub();
    };
  }, [currentUser.id]);

  const addHandler = () => {
    setIsAdd((prev) => !prev);
  };
  const [searchName, setSearchName] = useState("");
  const filterChats = chats.filter((c) =>
    c.user.username.toLowerCase().includes(searchName)
  );

  const { isContactClose, chatId } = useSelector(
    ({ chatStore }: { chatStore: chatStpreType }) => chatStore
  );

  const contactRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(closeContact());
  }, [chatId, dispatch]);

  return (
    <aside
      ref={contactRef}
      className={`contact ${
        chatId ? (isContactClose ? "active" : "") : "isEmpty"
      }`}
    >
      <div className="control">
        <div className="user">
          <img src={currentUser?.avatar || user} alt="user" />
          <h2 className="line-1-column">{currentUser?.username}</h2>
        </div>

        <div className="icons">
          <BsThreeDots size={20} />
          <HiMiniVideoCamera size={20} />
          <TbEdit size={20} />
        </div>
      </div>

      <div className="search">
        <label htmlFor="search-user" className="search-wrapper">
          <IoMdSearch size={20} id="search-icon" />
          <input
            type="text"
            id="search-user"
            onChange={(e) => setSearchName(e.target.value)}
          />
        </label>

        <button className="add-contact" onClick={addHandler}>
          {isAdd ? <MdOutlineRemove size={22} /> : <HiPlus size={20} />}
        </button>
      </div>

      <div className="user-wrapper">
        {filterChats.map((user: ChatDataType, i: number) => (
          <User chatData={chats} user={user} key={i} index={i} />
        ))}
      </div>

      {isAdd ? <FindUser close={addHandler} /> : null}
    </aside>
  );
};

export default Contacts;
