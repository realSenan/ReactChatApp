import Contacts from "./components/Contacts";
import Details from "./components/Details";
import Chat from "./components/Chat";
import Login from "./components/Login";

const App = () => {
  const user = false;

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
    </main>
  );
};

export default App;
