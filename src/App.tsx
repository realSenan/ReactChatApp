import Contacts from "./components/Contacts";
import Details from "./components/Details";
import Chat from "./components/Chat";
import Login from "./components/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./lib/firebase";
import { login } from "./redux/Thunk/Auth";
import { useSelector } from "react-redux";
import { store } from "./redux/store";
import Loading from "./layout/Loading";
import { chatStpreType } from "./redux/chatStore";
import { doc, onSnapshot } from "firebase/firestore";
import { CurrentUserType, setUser } from "./redux/authSlice";

export interface AuthState {
  currentUser: string | null | object;
}

const App = () => {
  const { currentUser } = useSelector(
    ({ auth }: { auth: { currentUser: CurrentUserType | null } }) => auth
  );

  const { isLoading } = useSelector(
    ({ auth }: { auth: { isLoading: boolean } }) => auth
  );

  const chatStore = useSelector(
    ({ chatStore }: { chatStore: chatStpreType }) => chatStore
  );

  useEffect(() => {
    let unsubUserDoc: (() => void) | undefined;

    const onSub = onAuthStateChanged(auth, (user) => {
      if (unsubUserDoc) {
        unsubUserDoc();
        unsubUserDoc = undefined;
      }

      store.dispatch(login(user?.uid));

      if (user?.uid) {
        unsubUserDoc = onSnapshot(doc(db, "users", user.uid), (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            store.dispatch(
              setUser({
                avatar: data.avatar || null,
                gender: data.gender || "unspecified",
                blocked: data.blocked || [],
                email: data.email || "",
                id: data.id || user.uid,
                username: data.username || "User",
                friends: data.friends || [],
                friendRequests: data.friendRequests || [],
                sentRequests: data.sentRequests || [],
              })
            );
          }
        });
      }
    });

    return () => {
      onSub();
      if (unsubUserDoc) unsubUserDoc();
    };
  }, []);

  return (
    <>
      <main className="container">
        {isLoading ? (
          <Loading />
        ) : currentUser ? (
          <>
            <Contacts />
            {chatStore.chatId ? (
              <>
                <Chat />
                <Details />
              </>
            ) : null}
          </>
        ) : (
          <Login />
        )}
      </main>
      {createPortal(
        <ToastContainer
          position="top-right"
          autoClose={2500}
          theme="dark"
          style={{ zIndex: 999999 }}
        />,
        document.body
      )}
    </>
  );
};

export default App;


