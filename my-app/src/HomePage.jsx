import React, { useState } from 'react';
import './App.css';
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleGetStartedClick = () => {
    setShowMenu(true);
  };

   const handleGetReturnClick = () => {
    setShowMenu(false);
  };

  const handleHallOfShameClick = () => {
    navigate("/HallOfShame");
  };
   const handleBookingClick = () => {
    navigate("/booking");
  };


  return (
    <div>
      <div
        className="homePage_background"
        style={{ backgroundImage: "url('/pictures/homepage_background.jpg')" }}
      >
        <header className="welcome_container">
          <h1>Välkommen till NH3!</h1>
        </header>
         <div className={`landing-page ${showMenu ? 'fade-out' : ''}`}></div>

        <button className="get-started-button" onClick={handleGetStartedClick}>
            Meny
        </button>

        <div className={`menu-container ${showMenu ? 'visible' : ''}`}>
          <div className="menu-header">
            <h1>Meny</h1>
          </div>
          <div className="menuButtons-container">
          <button className="hallOfShame-button" onClick={handleHallOfShameClick}>
                Hall Of Shame
          </button>

          <button className="booking-button" onClick={handleBookingClick}>
                Boka köket
          </button>
          </div>
          <button className="return-button" onClick={handleGetReturnClick}>
                Tillbaks
          </button>
        </div>
      </div>

     
    </div>
  );
};

export default HomePage;
