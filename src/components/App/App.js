import Ticket from '../Ticket/Ticket';
import './App.css';

// number of game tickets
const ticketsArr = Array(1)
  .fill('')
  .map((_, i) => ({ _id: i }));

function App() {
  return (
    <div className="app">
      <div className="app__content">
        {ticketsArr.map((ticket, i) => (
          <Ticket ticketNumber={i + 1} key={ticket._id} />
        ))}
      </div>
    </div>
  );
}

export default App;
