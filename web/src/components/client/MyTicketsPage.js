import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { FaTicketAlt, FaCalendarAlt, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import '../../styles/clientDashboard.css';

const MyTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyTickets = async () => {
      try {
        const response = await api.get('/tickets/mytickets');
        setTickets(response.data);
      } catch (error) {
        console.error("Error fetching my tickets:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyTickets();
  }, []);

  if (loading) return <div className="loading-container">Loading your tickets...</div>;

  const activeTickets = tickets.filter(t => t.status === 'Approved' || t.status === 'Completed');
  const pendingTickets = tickets.filter(t => t.status === 'Pending');

  return (
    <div className="client-page-content">
      <div className="dashboard-header">
        <h1>My Tickets</h1>
        <p>Manage and view all your purchased event tickets.</p>
      </div>

      <div className="tickets-section">
        <h2 className="section-title"><FaTicketAlt /> Active Tickets</h2>
        <div className="tickets-grid">
          {activeTickets.length > 0 ? (
            activeTickets.map(ticket => (
              <div key={ticket._id} className="ticket-card-ui">
                <div className="ticket-image">
                  <img src={ticket.event?.imageUrl || 'https://via.placeholder.com/300x150'} alt={ticket.event?.name} />
                  <span className="status-badge paid">Paid</span>
                </div>
                <div className="ticket-info">
                  <h3>{ticket.event?.name}</h3>
                  <div className="info-row"><FaCalendarAlt /> {new Date(ticket.event?.date).toLocaleDateString()}</div>
                  <div className="info-row"><FaClock /> {new Date(ticket.event?.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  {ticket.event?.location && <div className="info-row"><FaMapMarkerAlt /> {ticket.event.location}</div>}
                  <div className="ticket-footer">
                    <span className="ticket-id-sm">ID: {ticket._id.substring(0, 8)}</span>
                    <button className="btn-view-ticket">View QR</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">No active tickets found. Browse events to buy one!</div>
          )}
        </div>
      </div>

      {pendingTickets.length > 0 && (
        <div className="tickets-section pending-section">
          <h2 className="section-title"><FaClock /> Pending Payments</h2>
          <div className="tickets-grid">
            {pendingTickets.map(ticket => (
              <div key={ticket._id} className="ticket-card-ui pending">
                <div className="ticket-info">
                  <h3>{ticket.event?.name}</h3>
                  <p className="pending-note">Waiting for M-PESA confirmation...</p>
                  <div className="info-row"><FaCalendarAlt /> {new Date(ticket.event?.date).toLocaleDateString()}</div>
                  <div className="ticket-footer">
                    <span className="status-pill pending">Pending</span>
                    <button className="btn-secondary-sm">Check Status</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTicketsPage;
