import React, { useState, useEffect, useMemo } from 'react';
import api from '../../api/api';
import { 
  FaChartPie, 
  FaCalendarCheck, 
  FaMoneyBillWave, 
  FaChartLine 
} from 'react-icons/fa';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import '../../styles/clientDashboard.css';

const COLORS = ['#6a11cb', '#2575fc', '#ff4b2b', '#10b981', '#f59e0b'];

const AnalyticsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get('/tickets/mytickets');
        setTickets(response.data);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const stats = useMemo(() => {
    const totalTickets = tickets.length;
    const totalSpent = tickets.reduce((sum, t) => sum + (t.event?.price || 0), 0);
    const uniqueCategories = [...new Set(tickets.map(t => t.event?.category || 'General'))].length;
    
    // Data for Pie Chart (Spending by Category)
    const categoryData = {};
    tickets.forEach(t => {
      const cat = t.event?.category || 'General';
      categoryData[cat] = (categoryData[cat] || 0) + (t.event?.price || 0);
    });
    const pieData = Object.keys(categoryData).map(name => ({ name, value: categoryData[name] }));

    // Data for Bar Chart (Tickets per Month)
    const monthData = {};
    tickets.forEach(t => {
      const month = new Date(t.createdAt).toLocaleString('default', { month: 'short' });
      monthData[month] = (monthData[month] || 0) + 1;
    });
    const barData = Object.keys(monthData).map(name => ({ name, count: monthData[name] }));

    return { totalTickets, totalSpent, uniqueCategories, pieData, barData };
  }, [tickets]);

  if (loading) return <div className="loading-container">Analyzing your data...</div>;

  return (
    <div className="client-dashboard-overview">
      <div className="dashboard-header">
        <h1>My Insights</h1>
        <p>A visual breakdown of your event attendance and spending.</p>
      </div>

      <div className="cards-container">
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#e0e7ff' }}>
            <FaCalendarCheck style={{ color: '#4f46e5' }} />
          </div>
          <div>
            <h4>Total Events</h4>
            <p className="stat-value">{stats.totalTickets}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#dcfce7' }}>
            <FaMoneyBillWave style={{ color: '#16a34a' }} />
          </div>
          <div>
            <h4>Lifetime Spend</h4>
            <p className="stat-value">KES {stats.totalSpent.toLocaleString()}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#fef3c7' }}>
            <FaChartPie style={{ color: '#d97706' }} />
          </div>
          <div>
            <h4>Interests</h4>
            <p className="stat-value">{stats.uniqueCategories} Categories</p>
          </div>
        </div>
      </div>

      <div className="dashboard-main-grid">
        <div className="spotlight-card">
          <div className="card-header-flex">
            <h3>Spending by Category</h3>
            <FaChartPie style={{ color: '#94a3b8' }} />
          </div>
          <div style={{ height: '300px', marginTop: '1.5rem' }}>
            {stats.pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `KES ${value}`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state">No spending data yet.</div>
            )}
          </div>
        </div>

        <div className="spotlight-card">
          <div className="card-header-flex">
            <h3>Activity Frequency</h3>
            <FaChartLine style={{ color: '#94a3b8' }} />
          </div>
          <div style={{ height: '300px', marginTop: '1.5rem' }}>
            {stats.barData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.barData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: '#f8fafc'}} />
                  <Bar dataKey="count" fill="#6a11cb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state">No activity data yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
