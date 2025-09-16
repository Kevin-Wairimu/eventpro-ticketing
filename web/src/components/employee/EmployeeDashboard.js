import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { socket } from '../../socket'; // The shared socket instance
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, ResponsiveContainer } from 'recharts';
import { FaUsers, FaUserPlus, FaSyncAlt, FaChartLine } from 'react-icons/fa';
import user1 from '../../assets/user1.png';
import user2 from '../../assets/user2.png';
import user3 from '../../assets/user3.png';

// Mock data
const userGrowthData = [ /* ... */ ];
const clientActivityData = [ /* ... */ ];
const initialNewUsers = [
  { id: 1, name: "Lisa Anderson", timestamp: "2 minutes ago", status: "Pending", avatar: user1 },
  { id: 2, name: "Tom Rodriguez", timestamp: "15 minutes ago", status: "Pending", avatar: user2 },
  { id: 3, name: "James Brown", timestamp: "3 hours ago", status: "Approved", avatar: user3 },
];

const EmployeeDashboard = () => {
  const [newUsers, setNewUsers] = useState(initialNewUsers);

  const handleApprove = (userId) => {
    setNewUsers(newUsers.map(user => 
      user.id === userId ? { ...user, status: 'Approved' } : user
    ));
  };
  
  // --- REAL-TIME LISTENER FOR NEW USERS ---
  useEffect(() => {
    // Function to handle the incoming event
    const onNewUser = (newUser) => {
      // Show a pop-up notification
      toast.success(`New Client Registered: ${newUser.email}`);
      // Add the new user to the top of the "New User Registrations" list
      const userForUI = {
        id: newUser._id,
        name: newUser.email.split('@')[0],
        timestamp: "Just now",
        status: "Pending",
        avatar: user1 // default avatar
      };
      setNewUsers(prevUsers => [userForUI, ...prevUsers]);
    };

    // Attach the listener
    socket.on('newUserRegistered', onNewUser);

    // Clean up the listener when the component unmounts
    return () => {
      socket.off('newUserRegistered', onNewUser);
    };
  }, []); // Empty array ensures listener is set up only once

  return (
    <div className="employee-dashboard-content">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      {/* ... (the rest of your dashboard JSX is perfect) ... */}
      <div className="lists-grid">
        <div className="list-wrapper-emp">{/* ... Recent Clients ... */}</div>
        <div className="list-wrapper-emp">
          <div className="list-header"><h3>New User Registrations</h3><Link to="/employee/new-users">View All</Link></div>
           <ul className="client-list">
            {newUsers.map(user => (
              <li key={user.id}>
                <img src={user.avatar} alt={user.name}/>
                <div><h4>{user.name}</h4><p>{user.timestamp}</p></div>
                {user.status === 'Pending' && <button className="btn-approve" onClick={() => handleApprove(user.id)}>Approve</button>}
                {user.status === 'Approved' && <button className="btn-approved" disabled>Approved</button>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;