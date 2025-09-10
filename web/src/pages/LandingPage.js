import React from 'react';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';
import '../styles/landingPage.css';

// Using high-quality placeholders. Replace with your actual image paths.
import aboutImage from'../assets/about.svg';
import foodWineImage from "../assets/wines&expo.jpg";
import carAuctionImage from '../assets/car auction.jpg';
import carnivoreFestImage from '../assets/carnivore-fest.jpg';
import techHackathonImage from '../assets/tech-hackathon.jpg';

const LandingPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleBuyTicket = (eventId) => {
    currentUser ? navigate(`/events/${eventId}`) : navigate('/login');
  };

  return (
    <div className="landing-page" id='landingpage'>
      {/* --- HERO SECTION --- */}
      <header className="hero">
        <div className="hero-content">
          <h1>Unforgettable <span className="highlight">Events</span> Await You</h1>
          <p className="hero-subtitle">Creating magical moments and extraordinary experiences that bring people together since 2015.</p>
          <div className="hero-buttons">
            <button className="btn-primary">Explore Events</button>
            <button className="btn-secondary">Learn More</button>
          </div>
        </div>
      </header>

      {/* --- ABOUT SECTION --- */}
    <section id="about" className="about-section">
  <div className="section-container">
    <h2 className="section-title">About Eventoria</h2>
    <div className="about-content">
      <div className="about-text">
        {/* The h3 is removed for a cleaner look */}
        <p style={{ fontSize: '1.2rem', lineHeight: '1.8' }}>
          Event planning should be as joyful as the event itself. Eventoria empowers creators, businesses, and communities to bring people together with intuitive tools that handle all the complexity.
        </p>
        <p style={{ fontSize: '1.2rem', lineHeight: '1.8', fontWeight: '600', color: '#6a11cb' }}>
          Your Vision. Our Platform. Unforgettable Events.
        </p>
        {/* The stats are removed to keep it minimal. You could optionally add simpler icons here. */}
      </div>
      <div className="about-image">
        <img src={aboutImage} alt="A creative brainstorming session for an event" />
      </div>
    </div>
  </div>
</section>

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
                  <span className="event-date">Aug 15, 2024</span>
                  <h3>Food & Wine Expo</h3>
                  <p>A gourmet experience celebrating the finest foods and wines from around the world.</p>
                  <div className="event-location"><FaMapMarkerAlt /> Downtown Center</div>
                </div>
                <button className="buy-ticket-btn" onClick={() => handleBuyTicket('food-wine-expo')}>Buy Ticket</button>
              </div>
            </div>
            <div className="event-card">
              <img src={carAuctionImage} alt="Classic Car Auction" />
              <div className="event-info">
                <div>
                  <span className="event-tag auction">Auction</span>
                  <span className="event-date">Sep 05, 2024</span>
                  <h3>Classic Car Auction</h3>
                  <p>Featuring a stunning collection of vintage and exotic cars for enthusiasts and collectors.</p>
                  <div className="event-location"><FaMapMarkerAlt /> Grand Hall</div>
                </div>
                <button className="buy-ticket-btn" onClick={() => handleBuyTicket('car-auction')}>Buy Ticket</button>
              </div>
            </div>
            <div className="event-card">
              <img src={carnivoreFestImage} alt="Summer Carnivore Fest" />
              <div className="event-info">
                <div>
                  <span className="event-tag festival">Festival</span>
                  <span className="event-date">Sep 20, 2024</span>
                  <h3>Summer Carnivore Fest</h3>
                  <p>A meat-lover's paradise with the best BBQ, steaks, and live music activities.</p>
                  <div className="event-location"><FaMapMarkerAlt /> Riverside Park</div>
                </div>
                <button className="buy-ticket-btn" onClick={() => handleBuyTicket('carnivore-fest')}>Buy Ticket</button>
              </div>
            </div>
            <div className="event-card">
              <img src={techHackathonImage} alt="Annual Tech Hackathon" />
              <div className="event-info">
                <div>
                  <span className="event-tag tech">Tech</span>
                  <span className="event-date">Oct 10, 2024</span>
                  <h3>Annual Tech Hackathon</h3>
                  <p>A 24-hour coding challenge for developers, designers, and innovators to build solutions.</p>
                  <div className="event-location"><FaMapMarkerAlt /> Innovation Hub</div>
                </div>
                <button className="buy-ticket-btn" onClick={() => handleBuyTicket('tech-hackathon')}>Buy Ticket</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;