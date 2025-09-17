import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../AuthContext';
import api from '../../api/api'; // Your API instance
import { FaClock, FaCheckCircle } from 'react-icons/fa';
import defaultEventImage from '../../assets/event1.jpg'; // A fallback image

// --- Reusable and more robust TicketCard component ---
const TicketCard = ({ ticket }) => {
  // Gracefully handle cases where the event data might be missing
  const eventName = ticket?.event?.name || 'Event details not available';
  const eventDate = ticket?.event?.date ? new Date(ticket.event.date).toDateString() : 'Date not specified';
  const imageUrl = ticket?.event?.imageUrl || defaultEventImage;
  const status = ticket?.status || 'Unknown';

  return (
    <div className="ticket-card">
      <img src={imageUrl} alt={eventName} className="ticket-image" />
      <div className="ticket-details">
        <h3>{eventName}</h3>
        <p><FaClock /> {eventDate}</p>
        <div className={`status-pill ${status.toLowerCase()}`}>
          {status === 'Approved' && <FaCheckCircle />}
          {status}
        </div>
      </div>
    </div>
  );
};

const ClientDashboard = () => {
  const { currentUser } = useAuth();
  // --- UPDATED: Use fullName for a better greeting if it exists ---
  const userName = currentUser?.fullName || (currentUser?.email ? currentUser.email.split('@')[0].replace(/\b\w/g, l => l.toUpperCase()) : 'Client');
  
  const [myTickets, setMyTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Fetch user's tickets from the backend ---
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const fetchMyTickets = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/tickets/mytickets');
        setMyTickets(data);
      } catch (err) {
        console.error("Failed to fetch tickets:", err);
        setError("Could not load your tickets. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchMyTickets();
  }, [currentUser]); 

  // Memoize the filtered lists for performance
  const pendingTickets = useMemo(() => 
    myTickets.filter(t => t && t.event && (t.status === 'Pending' || t.status === 'Approved')), 
    [myTickets]
  );
  const pastTickets = useMemo(() => 
    myTickets.filter(t => t && t.event && (t.event.status === 'Completed' || new Date(t.event.date) < new Date())),
    [myTickets]
  );

  if (loading) {
    return <div className="client-page-container"><h2>Loading Your Tickets...</h2></div>;
  }
  if (error) {
    return <div className="client-page-container"><p className="error-message">{error}</p></div>;
  }

  return (
    <div className="client-page-container">
      <div className="dashboard-welcome">
        <h1>Welcome back, {userName}!</h1>
        <p>Here is a summary of your event tickets.</p>
      </div>

      <section className="ticket-section">
        <h2>Upcoming & Pending Tickets</h2>
        {pendingTickets.length > 0 ? (
          <div className="ticket-grid">
            {pendingTickets.map(ticket => <TicketCard key={ticket._id || ticket.id} ticket={ticket} />)}
          </div>
        ) : (
          <p className="no-tickets-message">You have no upcoming tickets.</p>
        )}
      </section>

      <section className="ticket-section">
        <h2>Ticket History</h2>
        {pastTickets.length > 0 ? (
          <div className="ticket-grid">
            {pastTickets.map(ticket => <TicketCard key={ticket._id || ticket.id} ticket={ticket} />)}
          </div>
        ) : (
          <p className="no-tickets-message">You have no past tickets.</p>
        )}
      </section>
    </div>
  );
};

export default ClientDashboard;