import React, { useState, useMemo } from 'react';
import { FaSearch, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';

// This is the complete list of all tickets
const mockHistory = [
  { id: 'EVT-006', eventName: 'Photography Masterclass', eventDate: '2024-11-20', status: 'Approved' },
  { id: 'EVT-003', eventName: 'Gourmet Food & Wine Expo', eventDate: '2024-11-05', status: 'Pending' },
  { id: 'EVT-001', eventName: 'Annual Tech Summit 2024', eventDate: '2024-10-26', status: 'Approved' },
  { id: 'EVT-002', eventName: 'Summer Music Festival', eventDate: '2024-08-15', status: 'Completed' },
  { id: 'EVT-004', eventName: 'Charity Gala Dinner', eventDate: '2024-12-01', status: 'Pending' },
  { id: 'EVT-005', eventName: 'Local Marathon 2024', eventDate: '2024-06-05', status: 'Completed' },
];

const HistoryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');

  const handleSort = () => setSortOrder(order => order === 'asc' ? 'desc' : 'asc');

  const filteredAndSortedTickets = useMemo(() => {
    return mockHistory
      .filter(ticket => ticket.eventName.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        const dateA = new Date(a.eventDate);
        const dateB = new Date(b.eventDate);
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });
  }, [searchTerm, sortOrder]);

  return (
    <div className="client-page-container">
      <div className="list-wrapper-client full-width">
        <div className="list-header">
          <div>
            <h3>My Tickets & History</h3>
            <p>A complete record of all your event tickets.</p>
          </div>
          <div className="header-actions">
            <div className="search-bar-client">
              <FaSearch className="search-icon" />
              <input type="text" placeholder="Search by event name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <button className="btn-action" onClick={handleSort}>
              {sortOrder === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />} Sort by Date
            </button>
          </div>
        </div>
        <div className="table-container-client">
          <table className="content-table-client">
            <thead><tr><th>Event Name</th><th>Event Date</th><th>Status</th></tr></thead>
            <tbody>
              {filteredAndSortedTickets.length > 0 ? (
                filteredAndSortedTickets.map(ticket => (
                  <tr key={ticket.id}>
                    <td>{ticket.eventName}</td>
                    <td>{new Date(ticket.eventDate).toLocaleDateString()}</td>
                    <td><span className={`status-pill ${ticket.status.toLowerCase()}`}>{ticket.status}</span></td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="3" className="no-results">No tickets found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;