import React from 'react';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaArrowRight, FaStar, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
// --- 1. Import the new useEvents hook ---
import { useEvents } from '../components/EventContext'; 
import '../styles/landingPage.css';

// Import images
import aboutImage from '../assets/carnivore-fest.jpg';
import defaultEventImage from "../assets/event1.jpg"; 

const LandingPage = () => {
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

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <div className="landing-page" id='landingpage'>
      {/* Hero Section */}
      <header className="hero">
        <div className="hero-overlay"></div>
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <span className="hero-badge">Next Generation Ticketing</span>
          <h1>Unforgettable <span className="highlight">Experiences</span> Await You</h1>
          <p className="hero-subtitle">Creating magical moments and extraordinary connections through seamless event management and discovery.</p>
          <div className="hero-actions">
            <a href="#events" className="btn-primary">Explore Events <FaArrowRight /></a>
            <a href="#about" className="btn-secondary">Learn More</a>
          </div>
        </motion.div>
        <div className="hero-scroll-indicator">
          <div className="mouse"></div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="stats-bar">
        <div className="section-container">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">150+</span>
              <span className="stat-label">Events Hosted</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50k+</span>
              <span className="stat-label">Tickets Sold</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">99%</span>
              <span className="stat-label">Customer Satisfaction</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Expert Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="section-container">
          <motion.div {...fadeInUp}>
            <h2 className="section-title">Crafting Unforgettable Moments</h2>
          </motion.div>
          
          <div className="about-content">
            <motion.div 
              className="about-text-wrapper"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h3>Your Vision, Perfectly Executed.</h3>
              <p>
                At Eventoria, we are more than just planners—we are architects of unforgettable experiences. Since 2015, our passion has been to bring people together, transforming ambitious visions into flawlessly executed realities. 
              </p>
              <ul className="about-features">
                <li><FaCheckCircle className="feature-icon" /> Premium Venue Selection</li>
                <li><FaCheckCircle className="feature-icon" /> End-to-end Event Planning</li>
                <li><FaCheckCircle className="feature-icon" /> Seamless Ticketing Experience</li>
                <li><FaCheckCircle className="feature-icon" /> Real-time Support & Analytics</li>
              </ul>
              <button className="learn-more-btn" onClick={() => navigate('/about')}>Discover Our Story</button>
            </motion.div>

            <motion.div 
              className="about-image-wrapper"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="image-experience-badge">
                <span className="years">10+</span>
                <span className="text">Years of Excellence</span>
              </div>
              <img src={aboutImage} alt="Eventoria Experience" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="events-section">
        <div className="section-container">
          <motion.div className="events-header" {...fadeInUp}>
            <h2 className="section-title">Upcoming Events</h2>
            <p className="section-subtitle">Discover and book the most anticipated events happening around you.</p>
          </motion.div>
          
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Fetching amazing events...</p>
            </div>
          ) : events.filter(e => e.status === 'Published').length === 0 ? (
            <div className="no-events-state">
              <div className="no-events-icon">📅</div>
              <h3>No Events Found</h3>
              <p>We're currently preparing some exciting new events. Please check back soon!</p>
            </div>
          ) : (
            <div className="events-grid">
              {events.filter(e => e.status === 'Published').map((event, index) => (
                <motion.div 
                  className="event-card" 
                  key={event.id || event._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="card-image">
                    <img src={event.imageUrl || defaultEventImage} alt={event.name} />
                    <div className="card-price-tag">${event.price || 0}</div>
                  </div>
                  <div className="event-info">
                    <div className="event-meta">
                      <span className="event-tag">{event.category || 'General'}</span>
                      <span className="event-date"><FaCalendarAlt /> {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <h3>{event.name}</h3>
                    <div className="event-details">
                      <span className="event-location"><FaMapMarkerAlt /> {event.location || 'Online'}</span>
                      <span className="event-capacity"><FaUsers /> {event.capacity} Slots</span>
                    </div>
                    <button 
                      className="buy-ticket-btn" 
                      onClick={() => handleBuyTicket(event.id || event._id, event.name, event.price || 0)}
                    >
                      Secure Your Spot
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="section-container">
          <motion.div className="cta-content" {...fadeInUp}>
            <h2>Ready to Host Your Own Event?</h2>
            <p>Join hundreds of organizers who trust Eventoria for their ticketing and management needs.</p>
            <button className="btn-white" onClick={() => navigate('/register')}>Get Started Today</button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;