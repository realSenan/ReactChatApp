import React, { useEffect, useMemo, useState } from "react";
import ResultUser from "./ResultUser";
import { toast } from "react-toastify";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { CurrentUserType } from "../../../redux/authSlice";
import { useSelector } from "react-redux";
import { IoMdSearch } from "react-icons/io";

interface Props {
  close: () => void;
}

// Instagram-style matching score: prefix > substring > character subsequence
const getMatchScore = (target: string, queryStr: string): number => {
  const t = target.toLowerCase();
  const q = queryStr.toLowerCase().trim();
  if (!q) return 1;
  if (t === q) return 100;
  if (t.startsWith(q)) return 80;
  if (t.includes(q)) return 60;

  // Subsequence check (all characters of q appear in order in t)
  let qIdx = 0;
  for (let i = 0; i < t.length && qIdx < q.length; i++) {
    if (t[i] === q[qIdx]) qIdx++;
  }
  if (qIdx === q.length) return 30;

  return 0;
};

const FindUser: React.FC<Props> = ({ close }) => {
  const [allUsers, setAllUsers] = useState<CurrentUserType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const { currentUser } = useSelector(
    ({ auth }: { auth: { currentUser: CurrentUserType } }) => auth
  );

  const stopClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const userRef = collection(db, "users");
        const snap = await getDocs(userRef);
        const list: CurrentUserType[] = [];
        snap.docs.forEach((docSnap) => {
          list.push(docSnap.data() as CurrentUserType);
        });
        setAllUsers(list);
      } catch (err) {
        if (err instanceof Error) {
          console.error(err.message);
          toast.error(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return allUsers
      .filter((usr) => {
        if (!usr.id || usr.id === currentUser?.id) return false;
        // Hide users blocked by currentUser or users who blocked currentUser
        if (currentUser?.blocked?.includes(usr.id)) return false;
        if (usr.blocked?.includes(currentUser?.id)) return false;
        return true;
      })
      .map((usr) => {
        const nameScore = getMatchScore(usr.username || "", searchTerm);
        const emailScore = getMatchScore(
          (usr.email || "").split("@")[0],
          searchTerm
        );
        return {
          usr,
          score: Math.max(nameScore, emailScore),
        };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.usr);
  }, [allUsers, searchTerm, currentUser]);

  return (
    <div onClick={close} className="find-user-modal">
      <div onClick={stopClick} className="inner-user-modal">
        <h3 style={{ marginBottom: "12px" }}>Find &amp; Add Friends</h3>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="insta-search-input-wrap">
            <IoMdSearch size={20} />
            <input
              type="text"
              placeholder="Search users by name or letters..."
              name="username"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </form>

        <section className="search-result">
          {loading ? (
            <p className="empty-search-text">Loading users...</p>
          ) : filteredUsers.length === 0 ? (
            <p className="empty-search-text">No matching users found.</p>
          ) : (
            filteredUsers.map((usr) => (
              <ResultUser
                key={usr.id}
                close={close}
                userId={usr.id}
                avatar={usr.avatar}
                gender={usr.gender}
                name={usr.username}
              />
            ))
          )}
        </section>
      </div>
    </div>
  );
};

export default FindUser;

