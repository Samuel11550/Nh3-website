import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from './HomePage';
import HallOfShame from './HallOfShame';
import { Provider } from 'react-redux';
import store from './store';
import './App.css';
import './HallOfShame.css';
import Booking from './Booking';
import './Booking.css';


function App() {
  return (
    <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/HallOfShame" element={<HallOfShame />} />
            <Route path="/booking" element={<Booking />} />
          </Routes>
        </Router>
    </Provider>
  );
}

export default App;
