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

const App = () => {
  const { currentUser } = useSelector(({ auth }) => auth);

  console.log(currentUser);

  useEffect(() => {
    const onSub = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        login(user?.uid);
      }
    });

    return () => {
      onSub();
    };
  }, []);

  return (
    <main className="container">
      {currentUser ? (
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
