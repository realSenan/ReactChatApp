import Contacts from "./components/Contacts";
import Details from "./components/Details";
import Chat from "./components/Chat";
import Login from "./components/Login";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const user = true;

  return (
    <main className="container">
      {user ? (
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
