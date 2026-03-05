import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../AuthContext';
import api from '../../api/api';
import { FaTicketAlt, FaHistory, FaCalendarCheck, FaArrowRight, FaCalendarAlt, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../../styles/clientDashboard.css';

const ClientDashboard = () => {
  const { currentUser } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const userName = currentUser?.email ? currentUser.email.split('@')[0] : 'Guest';

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get('/tickets/mytickets');
        setTickets(response.data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const stats = useMemo(() => {
    const active = tickets.filter(t => t.status === 'Approved').length;
    const pending = tickets.filter(t => t.status === 'Pending').length;
    const spent = tickets.reduce((sum, t) => sum + (t.event?.price || 0), 0);
    return { active, pending, spent };
  }, [tickets]);

  const upcomingEvent = useMemo(() => {
    return tickets
      .filter(t => t.status === 'Approved' && new Date(t.event?.date) > new Date())
      .sort((a, b) => new Date(a.event.date) - new Date(b.event.date))[0]?.event;
  }, [tickets]);

  if (loading) return <div className="loading-container">Loading Dashboard...</div>;

  return (
    <div className="client-dashboard-overview">
      <div className="dashboard-header">
        <div>
          <h1>Hello, {userName}! 👋</h1>
          <p>Ready for your next big experience? Here's your account summary.</p>
        </div>
        <Link to="/" className="btn-primary-action">
          Browse More Events <FaArrowRight />
        </Link>
      </div>

      <div className="cards-container">
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#e0e7ff' }}>
            <FaTicketAlt style={{ color: '#4f46e5' }} />
          </div>
          <div>
            <h4>Active Tickets</h4>
            <p className="stat-value">{stats.active}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#fef3c7' }}>
            <FaClock style={{ color: '#d97706' }} />
          </div>
          <div>
            <h4>Pending Paid</h4>
            <p className="stat-value">{stats.pending}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#dcfce7' }}>
            <FaCalendarCheck style={{ color: '#16a34a' }} />
          </div>
          <div>
            <h4>Total Spent</h4>
            <p className="stat-value">KES {stats.spent.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-main-grid">
        {/* Upcoming Event Spotlight */}
        <div className="spotlight-card">
          <div className="card-header-flex">
            <h3>Upcoming Event</h3>
            <Link to="/client/tickets" className="view-all-link">View All</Link>
          </div>
          
          {upcomingEvent ? (
            <div className="event-spotlight-content">
              <img src={upcomingEvent.imageUrl || 'https://via.placeholder.com/600x300'} alt={upcomingEvent.name} />
              <div className="spotlight-info">
                <h2>{upcomingEvent.name}</h2>
                <div className="spotlight-details">
                  <span><FaCalendarAlt /> {new Date(upcomingEvent.date).toLocaleDateString()}</span>
                  <span><FaClock /> {new Date(upcomingEvent.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span><FaMapMarkerAlt /> {upcomingEvent.location || 'Venue TBA'}</span>
                </div>
                <button className="btn-primary-action" style={{ width: '100%', marginTop: '1.5rem', justifyContent: 'center' }}>
                  View Ticket QR
                </button>
              </div>
            </div>
          ) : (
            <div className="empty-spotlight">
              <FaCalendarAlt className="empty-icon" />
              <p>No upcoming events scheduled.</p>
              <Link to="/" className="btn-secondary-sm">Find Events</Link>
            </div>
          )}
        </div>

        {/* Quick Actions & Recent History */}
        <div className="side-panel">
          <div className="action-card">
            <h3>Quick Actions</h3>
            <div className="action-buttons-grid">
              <Link to="/client/profile" className="action-btn"><FaCalendarCheck /> Edit Profile</Link>
              <Link to="/client/history" className="action-btn"><FaHistory /> Billing History</Link>
            </div>
          </div>

          <div className="recent-activity-card">
            <h3>Recent Tickets</h3>
            <div className="activity-list">
              {tickets.slice(0, 3).map(ticket => (
                <div key={ticket._id} className="activity-item">
                  <div className="activity-dot"></div>
                  <div className="activity-info">
                    <p className="activity-title">{ticket.event?.name}</p>
                    <p className="activity-time">{new Date(ticket.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`status-pill-xs ${ticket.status.toLowerCase()}`}>{ticket.status}</span>
                </div>
              ))}
              {tickets.length === 0 && <p className="empty-note">No recent activity.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
