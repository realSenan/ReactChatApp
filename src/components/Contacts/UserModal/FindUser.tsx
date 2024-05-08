import React, { useState } from "react";
import ResultUser from "./ResultUser";
import { toast } from "react-toastify";
import {
  collection,
  DocumentData,
  getDocs,
  query,
  QuerySnapshot,
  where,
} from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { CurrentUserType } from "../../../redux/authSlice";

interface Props {
  close: () => void;
}

const FindUser: React.FC<Props> = ({ close }) => {
  const [searchResultUser, setSearchResultUser] = useState<
    CurrentUserType[] | null
  >();
  const stopClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
  };

  const formHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username");

    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("username", "==", username));
      const querySnapShot: QuerySnapshot<DocumentData, DocumentData> =
        await getDocs(q);

      if (!querySnapShot.empty) {
        const data: CurrentUserType[] = [];
        querySnapShot.docs.forEach((x) =>
          data.push(x.data() as CurrentUserType)
        );
        setSearchResultUser(data);
      }
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
        toast.error(err.message);
      }
    }
  };

  return (
    <div onClick={close} className="find-user-modal">
      <div onClick={stopClick} className="inner-user-modal">
        <form onSubmit={formHandler}>
          <input type="text" placeholder="Username" name="username" />
          <button>Search</button>
        </form>

        <section className="search-result">
          {searchResultUser?.map((usr, i) => (
            <ResultUser
              key={i}
              close={close}
              userId={usr.id}
              avatar={usr.avatar}
              name={usr.username}
            />
          ))}
        </section>
      </div>
    </div>
  );
};

export default FindUser;
