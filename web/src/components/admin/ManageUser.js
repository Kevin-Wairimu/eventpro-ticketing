import React, { useState, useEffect, useMemo } from 'react';
import api from '../../api/api'; // Your API instance
import { socket } from '../../socket'; // Your shared socket instance
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSearch, FaUserShield, FaUserTie, FaUser, FaCheck, FaTimes } from 'react-icons/fa';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // --- 1. Initial Data Fetch (Corrected) ---
  // This useEffect fetches the full list of users when the component first mounts.
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        // This request will automatically have the admin's token attached by api.js
        const response = await api.get('/users');
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setError("Could not load user data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []); // The empty dependency array ensures this runs only once.

  // --- 2. Real-Time Listeners (This part is already excellent) ---
  useEffect(() => {
    const onNewUser = (newUser) => {
      toast.info(`🚀 New user needs approval: ${newUser.email}`);
      // Add the new user to the top of the existing list
      setUsers(prev => [newUser, ...prev]);
    };
    const onStatusUpdate = (updatedUser) => {
      toast.success(`User ${updatedUser.email} has been ${updatedUser.status.toLowerCase()}.`);
      // Find and update the user in the list
      setUsers(prev => prev.map(u => u._id === updatedUser._id ? updatedUser : u));
    };

    socket.on('newUserPending', onNewUser);
    socket.on('userStatusUpdated', onStatusUpdate);
    return () => {
      socket.off('newUserPending', onNewUser);
      socket.off('userStatusUpdated', onStatusUpdate);
    };
  }, []); // This also runs only once, setting up the listeners for the component's lifetime.

  // --- 3. CRUD Handlers (This part is also excellent) ---
  const handleUpdateStatus = async (userId, status) => {
    try {
      await api.put(`/users/${userId}/status`, { status });
      // The real-time listener will handle updating the state for all connected admins.
    } catch (error) {
      toast.error("Failed to update user status.");
    }
  };

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users.filter(user =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const getRoleIcon = (role) => { /* ... your existing icon logic ... */ };
  const formatDate = (dateString) => { /* ... your existing date format logic ... */ };

  // --- 4. Render States (Loading, Error, Content) ---
  if (loading) {
    return <div className="admin-page-content"><h2>Loading Users...</h2></div>;
  }
  if (error) {
    return <div className="admin-page-content"><div className="error-message">{error}</div></div>;
  }

  return (
    <div className="admin-page-content">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} theme="colored" />
      <div className="dashboard-header">
        <h1>User Management</h1>
        <p>View and manage all registered users in the system.</p>
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input type="text" className="form-input" placeholder="Search by email or role..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>
      <div className="table-container">
        <table className="content-table">
          <thead>
            <tr><th>Email</th><th>Role</th><th>Date Joined</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <tr key={user._id}>
                  <td>{user.email}</td>
                  <td className="user-role-cell">{getRoleIcon(user.role)}<span>{user.role}</span></td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td><span className={`status-pill ${user.status.toLowerCase()}`}>{user.status}</span></td>
                  <td className="action-buttons">
                    {user.status === 'Pending' && (
                      <>
                        <button className="btn-icon-deny" title="Deny User" onClick={() => handleUpdateStatus(user._id, 'Denied')}><FaTimes /></button>
                        <button className="btn-icon-approve" title="Approve User" onClick={() => handleUpdateStatus(user._id, 'Approved')}><FaCheck /></button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-results">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;