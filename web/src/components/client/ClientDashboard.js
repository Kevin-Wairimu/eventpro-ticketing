import React, { useMemo } from 'react';
import { useAuth } from '../AuthContext';
import { FaClock, FaCheckCircle } from 'react-icons/fa';
import eventImage1 from '../../assets/event1.jpg'; // Add placeholder event images to src/assets/
import eventImage2 from '../../assets/event2.jpg';
import eventImage3 from '../../assets/event3.jpg';

// Mock data simulating tickets for the currently logged-in client.
const mockClientTickets = [
  { id: 'EVT-001', eventName: 'Annual Tech Summit 2024', eventDate: '2024-10-26', status: 'Approved', imageUrl: eventImage1 },
  { id: 'EVT-002', eventName: 'Summer Music Festival', eventDate: '2024-08-15', status: 'Completed', imageUrl: eventImage2 },
  { id: 'EVT-003', eventName: 'Gourmet Food & Wine Expo', eventDate: '2024-11-05', status: 'Pending', imageUrl: eventImage3 },
  { id: 'EVT-004', eventName: 'Charity Gala Dinner', eventDate: '2024-12-01', status: 'Pending', imageUrl: eventImage1 },
];

// A reusable card component for displaying a single ticket
const TicketCard = ({ ticket }) => (
  <div className="ticket-card">
    <img src={ticket.imageUrl} alt={ticket.eventName} className="ticket-image" />
    <div className="ticket-details">
      <h3>{ticket.eventName}</h3>
      <p><FaClock /> {new Date(ticket.eventDate).toDateString()}</p>
      <div className={`status-pill ${ticket.status.toLowerCase()}`}>
        {ticket.status === 'Approved' && <FaCheckCircle />}
        {ticket.status}
      </div>
    </div>
  </div>
);

const ClientDashboard = () => {
  const { currentUser } = useAuth();
  const userName = currentUser?.email.split('@')[0].replace(/\b\w/g, l => l.toUpperCase()) || 'Client';

  // Memoize the filtered lists to prevent re-calculating on every render
  const pendingTickets = useMemo(() => 
    mockClientTickets.filter(t => t.status === 'Pending' || t.status === 'Approved'), 
    []
  );

  const pastTickets = useMemo(() => 
    mockClientTickets.filter(t => t.status === 'Completed'), 
    []
  );

  return (
    <div className="client-page-container">
    
      {/* Pending & Approved Tickets Section */}
      <section className="ticket-section">
        <h2>Upcoming & Pending Tickets</h2>
        {pendingTickets.length > 0 ? (
          <div className="ticket-grid">
            {pendingTickets.map(ticket => <TicketCard key={ticket.id} ticket={ticket} />)}
          </div>
        ) : (
          <p className="no-tickets-message">You have no upcoming tickets.</p>
        )}
      </section>

      {/* Ticket History Section */}
      <section className="ticket-section">
        <h2>Ticket History</h2>
        {pastTickets.length > 0 ? (
          <div className="ticket-grid">
            {pastTickets.map(ticket => <TicketCard key={ticket.id} ticket={ticket} />)}
          </div>
        ) : (
          <p className="no-tickets-message">You have no past tickets.</p>
        )}
      </section>
    </div>
  );
};

export default ClientDashboard;