import React from 'react';
import { FaSearch, FaEye, FaUndo, FaTicketAlt } from 'react-icons/fa';

// Mock data - replace with API call
const mockTickets = [
  { id: 'TIX-A4B7', event: 'Annual Tech Summit 2024', name: 'John Doe', type: 'VIP', status: 'Checked-In', price: 299.00 },
  { id: 'TIX-C8D1', event: 'Summer Music Festival', name: 'Jane Smith', type: 'Regular', status: 'Valid', price: 89.00 },
  { id: 'TIX-E2F5', event: 'Summer Music Festival', name: 'Peter Jones', type: 'Regular', status: 'Valid', price: 89.00 },
  { id: 'TIX-G6H9', event: 'Annual Tech Summit 2024', name: 'Sarah Lee', type: 'Student', status: 'Refunded', price: 149.00 },
  { id: 'TIX-I0J3', event: 'Gourmet Food & Wine Expo', name: 'Michael Chen', type: 'Group', status: 'Valid', price: 65.00 },
  { id: 'TIX-K4L7', event: 'Summer Music Festival', name: 'Emily White', type: 'Regular', status: 'Checked-In', price: 89.00 },
];

const ManageTickets = () => {
  return (
    <div className="admin-page-content">
      <div className="dashboard-header">
        <h1>Manage Tickets</h1>
        <p>View ticket sales, issue refunds, and manage individual tickets.</p>
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input type="text" className="form-input" placeholder="Search by Ticket ID, Name, or Event..." />
        </div>
      </div>

      <div className="table-container">
        <table className="content-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Event</th>
              <th>Attendee Name</th>
              <th>Type</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockTickets.map(ticket => (
              <tr key={ticket.id}>
                <td className="ticket-id"><FaTicketAlt /> {ticket.id}</td>
                <td>{ticket.event}</td>
                <td>{ticket.name}</td>
                <td>{ticket.type}</td>
                <td>${ticket.price.toFixed(2)}</td>
                <td><span className={`status-pill ${ticket.status.toLowerCase().replace('-', '')}`}>{ticket.status}</span></td>
                <td className="action-buttons">
                  <button className="btn-icon-view" aria-label="View Details"><FaEye /></button>
                  {ticket.status !== 'Refunded' && (
                     <button className="btn-icon-refund" aria-label="Refund Ticket"><FaUndo /></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageTickets;