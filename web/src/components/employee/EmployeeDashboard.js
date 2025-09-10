import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, ResponsiveContainer } from 'recharts';
import { FaUsers, FaUserPlus, FaSyncAlt, FaChartLine } from 'react-icons/fa';
import user1 from '../../assets/user1.png';
import user2 from '../../assets/user2.png';
import user3 from '../../assets/user3.png';
import user4 from '../../assets/user-avatar.png';

// Mock data
const userGrowthData = [ { name: 'Jan', "New Users": 50 }, { name: 'Feb', "New Users": 80 }, { name: 'Mar', "New Users": 120 }, { name: 'Apr', "New Users": 180 }, { name: 'May', "New Users": 250 } ];
const clientActivityData = [ { name: 'Mon', "Client Activity": 30 }, { name: 'Tue', "Client Activity": 50 }, { name: 'Wed', "Client Activity": 45 }, { name: 'Thu', "Client Activity": 60 }, { name: 'Fri', "Client Activity": 55 }, { name: 'Sat', "Client Activity": 70 } ];
const initialNewUsers = [
  { id: 1, name: "Lisa Anderson", timestamp: "2 minutes ago", status: "Pending", avatar: user1 },
  { id: 2, name: "Tom Rodriguez", timestamp: "15 minutes ago", status: "Pending", avatar: user2 },
  { id: 3, name: "James Brown", timestamp: "3 hours ago", status: "Approved", avatar: user3 },
];

const EmployeeDashboard = () => {
  // --- NEW: State to manage the list of new users ---
  const [newUsers, setNewUsers] = useState(initialNewUsers);

  // --- NEW: Function to handle approving a user ---
  const handleApprove = (userId) => {
    setNewUsers(newUsers.map(user => 
      user.id === userId ? { ...user, status: 'Approved' } : user
    ));
    // In a real app, you would also make an API call here
  };

  return (
    <div className="employee-dashboard-content">
      {/* Stat Cards */}
      <div className="stat-cards-grid">
        <div className="stat-card-emp"><div className="card-icon blue"><FaUsers/></div><h4>Total Clients</h4><p className="stat-value">2,847</p><p className="stat-change green">+12%</p></div>
        <div className="stat-card-emp"><div className="card-icon green"><FaUserPlus/></div><h4>New Users Today</h4><p className="stat-value">47</p><p className="stat-change green">+8%</p></div>
        <div className="stat-card-emp"><div className="card-icon purple"><FaSyncAlt/></div><h4>Active Sessions</h4><p className="stat-value">1,234</p><p className="stat-change green">+5%</p></div>
        <div className="stat-card-emp"><div className="card-icon orange"><FaChartLine/></div><h4>Conversion Rate</h4><p className="stat-value">24.5%</p><p className="stat-change red">-2%</p></div>
      </div>
      {/* Charts */}
      <div className="charts-grid">{/* ... Chart JSX ... */}</div>
      {/* Lists */}
      <div className="lists-grid">
        <div className="list-wrapper-emp">{/* ... Recent Clients JSX ... */}</div>
        <div className="list-wrapper-emp">
          <div className="list-header"><h3>New User Registrations</h3><Link to="/employee/new-users">View All</Link></div>
           <ul className="client-list">
            {newUsers.map(user => (
              <li key={user.id}>
                <img src={user.avatar} alt={user.name}/>
                <div><h4>{user.name}</h4><p>{user.timestamp}</p></div>
                {/* --- NEW: Conditional Rendering Logic --- */}
                {user.status === 'Pending' && (
                  <button className="btn-approve" onClick={() => handleApprove(user.id)}>Approve</button>
                )}
                {user.status === 'Approved' && (
                  <button className="btn-approved" disabled>Approved</button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;