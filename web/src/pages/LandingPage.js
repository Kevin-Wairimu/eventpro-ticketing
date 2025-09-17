import React from 'react';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';
// --- 1. Import the new useEvents hook ---
import { useEvents } from '../components/EventContext'; 
import '../styles/landingPage.css';

// // Import your placeholder images
import aboutImage from '../assets/carnivore-fest.jpg';
// import foodWineImage from "../assets/wines&expo.jpg";
// // Note: It's good practice to have a generic fallback image
import defaultEventImage from "../assets/event1.jpg"; 


const LandingPage = () => {
  // --- 2. Get events and loading state from the global context ---
  const { events, loading } = useEvents();
  const { currentUser, setRedirectPath } = useAuth();
  const navigate = useNavigate();

  const handleBuyTicket = (eventId, eventName, price) => {
    const checkoutPath = `/checkout/${eventId}`;
    if (currentUser) {
      navigate(checkoutPath, { state: { eventName, price } });
    } else {
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

      <section id="events" className="events-section">
        <div className="section-container">
          <h2 className="section-title">Upcoming Events</h2>
          
          {loading ? (
            <div className="loading-message">Loading events...</div>
          ) : events.filter(e => e.status === 'Published').length === 0 ? (
            <div className="no-events-message"><p>No upcoming events at this time.</p></div>
          ) : (
            <div className="events-grid">
              {events.filter(e => e.status === 'Published').map(event => (
                <div className="event-card" key={event._id}>
                  <img src={event.imageUrl || defaultEventImage} alt={event.name} />
                  <div className="event-info">
                    <div>
                      {/* ... other event details ... */}
                      <h3>{event.name}</h3>
                      <p>Price: ${event.price.toFixed(2)}</p>
                      {/* ... */}
                    </div>
                    {/* --- CRITICAL FIX: Pass the real event._id and event.price --- */}
                    <button 
                      className="buy-ticket-btn" 
                      onClick={() => handleBuyTicket(event._id, event.name, event.price)}
                    >
                      Buy Ticket
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* --- EVENTS SECTION (NOW FULLY DYNAMIC) --- */}
      <section id="events" className="events-section">
        <div className="section-container">
          <h2 className="section-title">Upcoming Events</h2>
          
          {/* --- 3. Add loading and empty states for a better UX --- */}
          {loading ? (
            <div className="loading-message">Loading events...</div>
          ) : events.filter(e => e.status === 'Published').length === 0 ? (
            <div className="no-events-message">
              <p>No upcoming events at this time. Please check back soon!</p>
            </div>
          ) : (
            <div className="events-grid">
              {/* --- 4. Map over the globally managed 'events' from the context --- */}
              {/* We only show events that the admin has marked as 'Published' */}
              {events.filter(e => e.status === 'Published').map(event => (
                <div className="event-card" key={event._id}>
                  <img src={event.imageUrl || defaultEventImage} alt={event.name} />
                  <div className="event-info">
                    <div>
                      {/* You can add a tag based on a property from your event data */}
                      <span className="event-tag corporate">{event.category || 'General'}</span>
                      <span className="event-date">{new Date(event.date).toLocaleDateString()}</span>
                      <h3>{event.name}</h3>
                      <p>Capacity: {event.capacity}</p>
                      <div className="event-location"><FaMapMarkerAlt /> {event.location || 'Online'}</div>
                    </div>
                    {/* The price should also come from the event data */}
                    <button 
                      className="buy-ticket-btn" 
                      onClick={() => handleBuyTicket(event._id, event.name, event.price || 99.99)}
                    >
                      Buy Ticket
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;