// --- THIS IS THE CRITICAL FIX ---
// Add 'useEffect' to the list of imports from React.
import React, { useState, useEffect } from 'react'; 
import { Link } from 'react-router-dom';
import { socket } from '../../socket';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LineChart, BarChart, /* ... other chart imports */ } from 'recharts';
import { FaUsers, FaUserPlus, /* ... other icon imports */ } from 'react-icons/fa';
import user1 from '../../assets/wines&expo.jpg';
import user2 from '../../assets/wines&expo.jpg';
import user3 from '../../assets/wines&expo.jpg';

// Mock data (remains the same)
const initialNewUsers = [
  { id: 1, name: "Lisa Anderson", timestamp: "2 minutes ago", status: "Pending", avatar: user1 },
  { id: 2, name: "Tom Rodriguez", timestamp: "15 minutes ago", status: "Pending", avatar: user2 },
  { id: 3, name: "James Brown", timestamp: "3 hours ago", status: "Approved", avatar: user3 },
];
// ... other mock data

const EmployeeDashboard = () => {
  const [newUsers, setNewUsers] = useState(initialNewUsers);

  // This function is now correctly defined because useEffect is imported.
  useEffect(() => {
    const onNewUser = (newUser) => {
      console.log("[EmployeeDashboard] Received 'newUserPending' event:", newUser);
      toast.info(`🚀 New client registered: ${newUser.email}`);

       socket.on('newUserPending', onNewUser);
      
      const userForUI = {
        id: newUser._id,
        name: newUser.email.split('@')[0],
        timestamp: "Just now",
        status: "Pending",
        avatar: user1 // Use a default avatar
      };
      setNewUsers(prevUsers => [userForUI, ...prevUsers]);
    };

    console.log("[EmployeeDashboard] Setting up 'newUserPending' listener.");
    socket.on('newUserPending', onNewUser);

      return () => {
      socket.off('newUserPending', onNewUser);
    };
  }, []); // The empty dependency array is correct.

  const handleApprove = (userId) => {
    setNewUsers(users => users.map(user => 
      user.id === userId ? { ...user, status: 'Approved' } : user
    ));
  };

  return (
    <div className="employee-dashboard-content">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} theme="colored" />
      
      {/* ... the rest of your dashboard JSX ... */}
      
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