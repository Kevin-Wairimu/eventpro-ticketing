import React from "react";
import "../../styles/adminDashboard.css";
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

// Data for the charts
const revenueData = [
  { month: "Jan", revenue: 12000 }, { month: "Feb", revenue: 15000 },
  { month: "Mar", revenue: 18000 }, { month: "Apr", revenue: 22000 },
  { month: "May", revenue: 25000 }, { month: "Jun", revenue: 28000 },
  { month: "Jul", revenue: 32000 },
];
const ticketData = [
  { name: "VIP", value: 25 }, { name: "Regular", value: 45 },
  { name: "Student", value: 20 }, { name: "Group", value: 10 },
];

// Themed colors for the pie chart
const COLORS = ["#6a11cb", "#2575fc", "#8a2be2", "#ffdd57"];

const AdminDashboard = () => {
  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome back, Admin!</p>
      </div>

      <div className="cards-container">
        <div className="stat-card">
          <h4>Total Events</h4>
          <p className="stat-value">24</p>
          <p className="stat-change green">+12% this month</p>
        </div>
        <div className="stat-card">
          <h4>Tickets Sold</h4>
          <p className="stat-value">1,847</p>
          <p className="stat-change green">+8% this week</p>
        </div>
        <div className="stat-card">
          <h4>Total Revenue</h4>
          <p className="stat-value">$89,247</p>
          <p className="stat-change green">+15% this month</p>
        </div>
        <div className="stat-card">
          <h4>Active Events</h4>
          <p className="stat-value">7</p>
          <p className="stat-change red">-2 from last week</p>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-wrapper">
          <h3>Revenue Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#6a11cb" strokeWidth={3} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-wrapper">
          <h3>Ticket Sales by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie 
                data={ticketData} 
                cx="50%" 
                cy="50%" 
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100} 
                fill="#8884d8" 
                dataKey="value"
              >
                {ticketData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;