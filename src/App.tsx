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

interface AuthState {
  currentUser: string | null | object;
}

const App = () => {
  const { currentUser }: AuthState = useSelector(
    ({ auth }: { auth: AuthState }) => auth
  );
  console.log(currentUser)

  const { isLoading }: { isLoading: boolean } = useSelector(
    ({ auth }: { auth: { isLoading: boolean } }) => auth
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
          <Chat />
          <Details />
        </>
      ) : (
        <Login />
      )}
      <ToastContainer position="bottom-right" />
    </main>
  );
};

export default App;
