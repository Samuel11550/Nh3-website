import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from './HomePage';
import HallOfShame from './HallOfShame';
import { Provider } from 'react-redux';
import { store } from './store'; // Fixat: Måsvingar tillagda
import './App.css';
import Booking from './Booking';


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
