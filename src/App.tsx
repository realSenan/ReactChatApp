import Contacts from "./components/Contacts";
import Details from "./components/Details";
import Chat from "./components/Chat";
import Login from "./components/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { login } from "./redux/Thunk/Auth";
import { useSelector } from "react-redux";
import { store } from "./redux/store";
import Loading from "./layout/Loading";
import { chatStpreType } from "./redux/chatStore";

export interface AuthState {
  currentUser: string | null | object;
}

const App = () => {
  const { currentUser } = useSelector(
    ({ auth }: { auth: { currentUser: AuthState } }) => auth
  );

  const { isLoading } = useSelector(
    ({ auth }: { auth: { isLoading: boolean } }) => auth
  );

  const chatStore = useSelector(
    ({ chatStore }: { chatStore: chatStpreType }) => chatStore
  );

  useEffect(() => {
    const onSub = onAuthStateChanged(auth, (user) => {
      store.dispatch(login(user?.uid));
    });

    return () => {
      onSub();
    };
  }, []);

  return (
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
      <ToastContainer position="bottom-right" />
    </main>
  );
};

export default App;
