import Contacts from "./components/Contacts";
import Details from "./components/Details";
import Chat from "./components/Chat";

const App = () => {
  return (
    <main className="container">
      <Contacts />
      <Chat />
      <Details />
    </main>
  );
};

export default App;
