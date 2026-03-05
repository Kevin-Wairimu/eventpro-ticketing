import React, { useState, useEffect } from 'react';
import { FaSearch, FaEye, FaUndo, FaTicketAlt } from 'react-icons/fa';
import api from '../../api/api';
import { socket } from '../../socket';

const ManageTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get('/tickets');
        setTickets(response.data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();

    socket.on('ticketCreated', (newTicket) => {
      setTickets(prev => [newTicket, ...prev]);
    });

    return () => {
      socket.off('ticketCreated');
    };
  }, []);

  const filteredTickets = tickets.filter(ticket => 
    ticket._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.event?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading-container">Loading Tickets...</div>;

  return (
    <div className="admin-page-content">
      <div className="dashboard-header">
        <h1>Manage Tickets</h1>
        <p>View ticket sales, issue refunds, and manage individual tickets.</p>
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search by Ticket ID, Email, or Event..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="table-container">
        <table className="content-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Event</th>
              <th>Attendee Email</th>
              <th>Price</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map(ticket => (
              <tr key={ticket._id}>
                <td className="ticket-id"><FaTicketAlt /> {ticket._id.substring(0, 8)}...</td>
                <td>{ticket.event?.name || 'Unknown Event'}</td>
                <td>{ticket.user?.email || 'N/A'}</td>
                <td>${ticket.event?.price?.toFixed(2) || '0.00'}</td>
                <td>
                  <span className={`status-pill ${ticket.status.toLowerCase()}`}>
                    {ticket.status}
                  </span>
                </td>
                <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                <td className="action-buttons">
                  <button className="btn-icon-view" title="View Details"><FaEye /></button>
                  {ticket.status !== 'Refunded' && (
                     <button className="btn-icon-refund" title="Refund Ticket"><FaUndo /></button>
                  )}
                </td>
              </tr>
            ))}
            {filteredTickets.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>No tickets found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageTickets;
