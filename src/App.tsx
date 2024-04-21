import Contacts from "./components/Contacts";
import Details from "./components/Details";
import Message from "./components/Message";

const App = () => {
  return (
    <main className="container">
      <Contacts />
      <Message />
      <Details />
    </main>
  );
};

export default App;
