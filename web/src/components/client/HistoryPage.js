import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { FaHistory, FaDownload, FaFilter, FaMoneyBillWave } from 'react-icons/fa';
import '../../styles/clientDashboard.css';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/tickets/mytickets');
        // For history, we show everything, but maybe sorted by date descending
        const sortedHistory = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setHistory(sortedHistory);
      } catch (error) {
        console.error("Error fetching transaction history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <div className="loading-container">Loading your history...</div>;

  return (
    <div className="client-page-content">
      <div className="dashboard-header">
        <h1>Purchase History</h1>
        <p>A record of all your event ticket transactions.</p>
      </div>

      <div className="history-filters">
        <div className="search-bar">
          <FaFilter className="search-icon" />
          <input type="text" className="form-input" placeholder="Filter by event name..." />
        </div>
        <button className="btn-secondary"><FaDownload /> Export CSV</button>
      </div>

      <div className="table-container">
        <table className="content-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Event</th>
              <th>Transaction ID</th>
              <th>Amount</th>
              <th>Payment Method</th>
              <th>Status</th>
              <th>Invoice</th>
            </tr>
          </thead>
          <tbody>
            {history.length > 0 ? (
              history.map(item => (
                <tr key={item._id}>
                  <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td style={{ fontWeight: '600' }}>{item.event?.name}</td>
                  <td className="ticket-id">TRX-{item._id.substring(0, 8).toUpperCase()}</td>
                  <td style={{ fontWeight: '700' }}>KES {item.event?.price?.toFixed(2)}</td>
                  <td><FaMoneyBillWave style={{ color: '#166534', marginRight: '0.5rem' }} /> M-PESA</td>
                  <td><span className={`status-pill ${item.status.toLowerCase()}`}>{item.status}</span></td>
                  <td><button className="btn-icon-view" title="Download Invoice"><FaDownload /></button></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-results">No transactions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryPage;
