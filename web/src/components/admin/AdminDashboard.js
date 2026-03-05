import React, { useState, useEffect, useMemo } from "react";
import "../../styles/adminDashboard.css";
import api from "../../api/api";
import { socket } from "../../socket";
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer 
} from "recharts";
import { FaCalendarAlt, FaTicketAlt, FaDollarSign, FaUsers } from 'react-icons/fa';

const COLORS = ["#6a11cb", "#2575fc", "#8a2be2", "#ffdd57", "#ff4b2b"];

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, ticketsRes, usersRes] = await Promise.all([
          api.get("/events"),
          api.get("/tickets"),
          api.get("/users")
        ]);
        setEvents(eventsRes.data);
        setTickets(ticketsRes.data);
        setUsers(usersRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Socket listeners for real-time updates
    socket.on("eventCreated", (newEvent) => setEvents(prev => [newEvent, ...prev]));
    socket.on("eventUpdated", (updatedEvent) => setEvents(prev => prev.map(e => e._id === updatedEvent._id ? updatedEvent : e)));
    socket.on("eventDeleted", (eventId) => setEvents(prev => prev.filter(e => e._id !== eventId)));
    
    socket.on("ticketCreated", (newTicket) => {
      setTickets(prev => [newTicket, ...prev]);
      // Also update the event's ticketsSold count locally
      setEvents(prev => prev.map(e => e._id === newTicket.event._id ? { ...e, ticketsSold: (e.ticketsSold || 0) + 1 } : e));
    });

    socket.on("newUserPending", (newUser) => setUsers(prev => [newUser, ...prev]));
    socket.on("userStatusUpdated", (updatedUser) => setUsers(prev => prev.map(u => u._id === updatedUser._id ? updatedUser : u)));

    return () => {
      socket.off("eventCreated");
      socket.off("eventUpdated");
      socket.off("eventDeleted");
      socket.off("ticketCreated");
      socket.off("newUserPending");
      socket.off("userStatusUpdated");
    };
  }, []);

  const stats = useMemo(() => {
    const totalEvents = events.length;
    const ticketsSold = tickets.length;
    const totalRevenue = tickets.reduce((sum, t) => sum + (t.event?.price || 0), 0);
    const activeEvents = events.filter(e => e.status === "Published").length;
    const pendingUsers = users.filter(u => u.status === "Pending").length;

    return { totalEvents, ticketsSold, totalRevenue, activeEvents, pendingUsers };
  }, [events, tickets, users]);

  const revenueByMonth = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const data = months.map(m => ({ month: m, revenue: 0 }));
    
    tickets.forEach(t => {
      const date = new Date(t.createdAt);
      const monthIndex = date.getMonth();
      data[monthIndex].revenue += (t.event?.price || 0);
    });

    // Return only months that have passed in the current year
    const currentMonth = new Date().getMonth();
    return data.slice(0, currentMonth + 1);
  }, [tickets]);

  const ticketTypeData = useMemo(() => {
    const categories = {};
    events.forEach(e => {
      if (e.category) {
        categories[e.category] = (categories[e.category] || 0) + (e.ticketsSold || 0);
      }
    });
    return Object.keys(categories).map(cat => ({ name: cat, value: categories[cat] }));
  }, [events]);

  if (loading) return <div className="loading-container">Loading Dashboard...</div>;

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <p>Real-time statistics for your event platform.</p>
      </div>

      <div className="cards-container">
        <div className="stat-card">
          <div className="stat-icon-wrapper"><FaCalendarAlt className="stat-icon" /></div>
          <div>
            <h4>Total Events</h4>
            <p className="stat-value">{stats.totalEvents}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper"><FaTicketAlt className="stat-icon" /></div>
          <div>
            <h4>Tickets Sold</h4>
            <p className="stat-value">{stats.ticketsSold}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper"><FaDollarSign className="stat-icon" /></div>
          <div>
            <h4>Total Revenue</h4>
            <p className="stat-value">${stats.totalRevenue.toLocaleString()}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper"><FaUsers className="stat-icon" /></div>
          <div>
            <h4>Pending Users</h4>
            <p className="stat-value">{stats.pendingUsers}</p>
          </div>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-wrapper">
          <h3>Revenue Trends (USD)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueByMonth} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value}`} />
              <Line type="monotone" dataKey="revenue" stroke="#6a11cb" strokeWidth={3} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-wrapper">
          <h3>Ticket Sales by Category</h3>
          {ticketTypeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie 
                  data={ticketTypeData} 
                  cx="50%" 
                  cy="50%" 
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100} 
                  fill="#8884d8" 
                  dataKey="value"
                >
                  {ticketTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="no-data">No sales data yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
