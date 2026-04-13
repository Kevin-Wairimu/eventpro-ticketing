import React, { useState } from "react";
import { useEvents } from "../components/EventContext";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaSearch, FaFilter } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import defaultEventImage from "../assets/event1.jpg";

const CATEGORIES = ["All", "Food & Drink", "Technology", "Lifestyle", "Business", "General"];

export default function BrowseEvents() {
  const { events, loading } = useEvents();
  const { currentUser, setRedirectPath } = useAuth();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const handleBuyTicket = (eventId, eventName, price) => {
    const checkoutPath = `/checkout/${eventId}`;
    if (currentUser) {
      navigate(checkoutPath, { state: { eventName, price } });
    } else {
      setRedirectPath({ path: checkoutPath, state: { eventName, price } });
      navigate('/login');
    }
  };

  const filteredEvents = events
    .filter(e => e.status === 'Published')
    .filter(e => activeCategory === "All" || e.category === activeCategory)
    .filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                 (e.location && e.location.toLowerCase().includes(searchTerm.toLowerCase())));

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading the latest events...</p>
      </div>
    );
  }

  return (
    <div className="browse-events-page bg-gray-50 min-h-screen">
      {/* Header Section */}
      <section className="bg-dark py-12 px-6 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Discover Your Next Experience</h1>
          <p className="text-gray-400 mb-8">Browse and filter through the best events happening in Nairobi and beyond.</p>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search by event name or location..." 
              className="w-full pl-12 pr-4 py-4 rounded-xl border-none focus:ring-2 focus:ring-primary text-dark"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      <div className="section-container py-12">
        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
            <FaFilter className="text-primary flex-shrink-0" />
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat 
                  ? "bg-primary text-white shadow-md scale-105" 
                  : "bg-white text-gray-600 border border-gray-200 hover:border-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 font-medium">Showing {filteredEvents.length} events</p>
        </div>

        {/* Events Grid */}
        <AnimatePresence mode="popLayout">
          {filteredEvents.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-dark">No events found</h3>
              <p className="text-gray-500">Try adjusting your search or filters.</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event, index) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="event-card group" 
                  key={event.id || event._id}
                >
                  <div className="card-image overflow-hidden">
                    <img 
                      src={event.imageUrl || defaultEventImage} 
                      alt={event.name} 
                      className="transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="card-price-tag">${event.price || 0}</div>
                  </div>
                  <div className="event-info">
                    <div className="event-meta">
                      <span className="event-tag">{event.category || 'General'}</span>
                      <span className="event-date">
                        <FaCalendarAlt /> 
                        {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <h3 className="group-hover:text-primary transition-colors">{event.name}</h3>
                    <div className="event-details">
                      <span className="event-location"><FaMapMarkerAlt /> {event.location || 'Online'}</span>
                      <span className="event-capacity"><FaUsers /> {event.capacity} Slots Available</span>
                    </div>
                    <button 
                      className="buy-ticket-btn" 
                      onClick={() => handleBuyTicket(event.id || event._id, event.name, event.price || 0)}
                    >
                      Book Ticket
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
