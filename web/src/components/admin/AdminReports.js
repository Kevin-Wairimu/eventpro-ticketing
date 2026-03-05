import React, { useState, useEffect, useMemo } from 'react';
import { 
  FaDownload, 
  FaChartLine, 
  FaUsers, 
  FaDollarSign, 
  FaCalendarCheck,
  FaFileInvoiceDollar,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import api from '../../api/api';
import { socket } from '../../socket';

const AdminReports = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tRes, uRes, eRes] = await Promise.all([
          api.get('/tickets'),
          api.get('/users'),
          api.get('/events')
        ]);
        setTickets(tRes.data);
        setUsers(uRes.data);
        setEvents(eRes.data);
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    socket.on('ticketCreated', (newTicket) => setTickets(prev => [newTicket, ...prev]));
    socket.on('newUserPending', (newUser) => setUsers(prev => [newUser, ...prev]));

    return () => {
      socket.off('ticketCreated');
      socket.off('newUserPending');
    };
  }, []);

  const stats = useMemo(() => {
    const totalRevenue = tickets.reduce((sum, t) => sum + (t.event?.price || 0), 0);
    const totalTickets = tickets.length;
    const totalUsers = users.length;
    const totalEvents = events.length;

    return { totalRevenue, totalTickets, totalUsers, totalEvents };
  }, [tickets, users, events]);

  const chartData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return months.map((m, i) => {
      const rev = tickets
        .filter(t => new Date(t.createdAt).getMonth() === i)
        .reduce((sum, t) => sum + (t.event?.price || 0), 0);
      return { name: m, revenue: rev };
    });
  }, [tickets]);

  if (loading) return <div className="loading-container">Generating Reports...</div>;

  return (
    <div className="admin-page-content">
      <div className="dashboard-header">
        <div>
          <h1>System Reports</h1>
          <p>Comprehensive analysis of sales, attendance, and platform growth.</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" style={{ marginRight: '1rem' }}>
            <FaDownload /> Export All Data
          </button>
          <button className="btn-primary-admin">
            <FaFileInvoiceDollar /> Print Summary
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="cards-container">
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#dcfce7' }}>
            <FaDollarSign style={{ color: '#166534' }} />
          </div>
          <div>
            <h4>Total Revenue</h4>
            <p className="stat-value">${stats.totalRevenue.toLocaleString()}</p>
            <span className="stat-change green"><FaArrowUp /> 12.5%</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#e0e7ff' }}>
            <FaChartLine style={{ color: '#3730a3' }} />
          </div>
          <div>
            <h4>Ticket Sales</h4>
            <p className="stat-value">{stats.totalTickets}</p>
            <span className="stat-change green"><FaArrowUp /> 8.2%</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#fef3c7' }}>
            <FaUsers style={{ color: '#92400e' }} />
          </div>
          <div>
            <h4>Total Users</h4>
            <p className="stat-value">{stats.totalUsers}</p>
            <span className="stat-change green"><FaArrowUp /> 5.1%</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#f1f5f9' }}>
            <FaCalendarCheck style={{ color: '#475569' }} />
          </div>
          <div>
            <h4>Events Run</h4>
            <p className="stat-value">{stats.totalEvents}</p>
            <span className="stat-change red"><FaArrowDown /> 2.3%</span>
          </div>
        </div>
      </div>

      <div className="reports-main-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        {/* Revenue Visualization */}
        <div className="chart-wrapper">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>Revenue Growth</h3>
            <select className="form-input" style={{ width: 'auto', padding: '0.25rem 0.5rem' }}>
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6a11cb" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#6a11cb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                formatter={(value) => [`$${value}`, 'Revenue']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#6a11cb" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Report Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="report-card" style={{ padding: '1.5rem' }}>
            <div className="report-header">
              <FaDownload className="report-icon" style={{ fontSize: '1.2rem' }} />
              <h4 style={{ margin: 0 }}>Export Center</h4>
            </div>
            <p style={{ fontSize: '0.85rem', margin: '1rem 0' }}>Download specific data subsets for offline analysis.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button className="btn-secondary" style={{ justifyContent: 'flex-start', fontSize: '0.8rem' }}>Download Sales (CSV)</button>
              <button className="btn-secondary" style={{ justifyContent: 'flex-start', fontSize: '0.8rem' }}>Download Users (PDF)</button>
              <button className="btn-secondary" style={{ justifyContent: 'flex-start', fontSize: '0.8rem' }}>Event Analytics (XLSX)</button>
            </div>
          </div>
          <div className="report-card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', color: 'white' }}>
            <h4 style={{ marginBottom: '0.5rem' }}>Scheduled Reports</h4>
            <p style={{ fontSize: '0.8rem', opacity: 0.8, marginBottom: '1rem' }}>Automatic reports sent to your email weekly.</p>
            <button className="btn-primary-admin" style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>Configure</button>
          </div>
        </div>
      </div>

      {/* Recent Sales Table */}
      <div className="table-container">
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Recent Transactions</h3>
          <button className="btn-secondary" style={{ fontSize: '0.8rem' }}>View All Transactions</button>
        </div>
        <table className="content-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Attendee</th>
              <th>Event</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tickets.slice(0, 5).map(ticket => (
              <tr key={ticket._id}>
                <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                <td>
                  <div style={{ fontWeight: 600 }}>{ticket.user?.email.split('@')[0]}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{ticket.user?.email}</div>
                </td>
                <td>{ticket.event?.name}</td>
                <td style={{ fontWeight: 700, color: '#1e293b' }}>${ticket.event?.price?.toFixed(2)}</td>
                <td>
                  <span className={`status-pill approved`}>Success</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminReports;
