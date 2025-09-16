import React from 'react';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';
import '../styles/landingPage.css';

// Import your images
import aboutImage from '../assets/about.svg';
import foodWineImage from "../assets/wines&expo.jpg";
import carAuctionImage from '../assets/car auction.jpg';
import carnivoreFestImage from '../assets/carnivore-fest.jpg';
import techHackathonImage from '../assets/tech-hackathon.jpg';

const LandingPage = () => {
  // --- UPDATED: Get setRedirectPath from context ---
  const { currentUser, setRedirectPath } = useAuth();
  const navigate = useNavigate();

  // --- UPDATED: This function is now much smarter ---
  const handleBuyTicket = (eventId, eventName, price) => {
    const checkoutPath = `/checkout/${eventId}`;

    if (currentUser) {
      // If user is logged in, go directly to checkout with event details
      navigate(checkoutPath, { state: { eventName, price } });
    } else {
      // If user is logged out, save the destination and send to login
      setRedirectPath({ path: checkoutPath, state: { eventName, price } });
      navigate('/login');
    }
  };

  return (
    <div className="landing-page" id='landingpage'>
      <header className="hero">
        <div className="hero-content">
          <h1>Unforgettable <span className="highlight">Events</span> Await You</h1>
          <p className="hero-subtitle">Creating magical moments and extraordinary experiences that bring people together since 2022.</p>
        </div>
      </header>

      <section id="about" className="about-section">{/* ...About content... */}</section>



      {/* --- EVENTS SECTION --- */}
      <section id="events" className="events-section">
        <div className="section-container">
          <h2 className="section-title">Upcoming Events</h2>
          <div className="events-grid">
            
            <div className="event-card">
              <img src={foodWineImage} alt="Food & Wine Expo" />
              <div className="event-info">
                <div>
                  <span className="event-tag corporate">Food & Wine</span>
                  <h3>Food & Wine Expo</h3>
                  {/* ... */}
                </div>
                {/* --- FIX: Use the exact matching ID from the backend --- */}
                <button className="buy-ticket-btn" onClick={() => handleBuyTicket('food-wine-expo-2024', 'Food & Wine Expo', 75.00)}>Buy Ticket</button>
              </div>
            </div>

            <div className="event-card">
              <img src={carAuctionImage} alt="Classic Car Auction" />
              <div className="event-info">
                <div>
                  <span className="event-tag auction">Auction</span>
                  <h3>Classic Car Auction</h3>
                  {/* ... */}
                </div>
                {/* --- FIX: Use the exact matching ID from the backend --- */}
                <button className="buy-ticket-btn" onClick={() => handleBuyTicket('classic-car-auction-fall', 'Classic Car Auction', 25.00)}>Buy Ticket</button>
              </div>
            </div>

            <div className="event-card">
              <img src={carnivoreFestImage} alt="Summer Carnivore Fest" />
              <div className="event-info">
                <div>
                  <span className="event-tag festival">Festival</span>
                  <h3>Summer Carnivore Fest</h3>
                  {/* ... */}
                </div>
                {/* --- FIX: Use the exact matching ID from the backend --- */}
                <button className="buy-ticket-btn" onClick={() => handleBuyTicket('summer-carnivore-fest', 'Summer Carnivore Fest', 50.00)}>Buy Ticket</button>
              </div>
            </div>

            <div className="event-card">
              <img src={techHackathonImage} alt="Annual Tech Hackathon" />
              <div className="event-info">
                <div>
                  <span className="event-tag tech">Tech</span>
                  <h3>Annual Tech Summit</h3>
                  {/* ... */}
                </div>
                {/* --- FIX: Use the exact matching ID from the backend --- */}
                <button className="buy-ticket-btn" onClick={() => handleBuyTicket('tech-summit-2024', 'Annual Tech Summit', 199.99)}>Buy Ticket</button>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;