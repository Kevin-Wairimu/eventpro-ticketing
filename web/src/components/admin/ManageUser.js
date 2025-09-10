import React, { useState, useEffect, useMemo } from 'react';
import api from '../../api/api'; // Your API instance
import { FaSearch, FaUserShield, FaUserTie, FaUser, FaCheckCircle, FaBan } from 'react-icons/fa';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await api.get('/users');
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <FaUserShield className="role-icon admin" />;
      case 'employee': return <FaUserTie className="role-icon employee" />;
      case 'client': return <FaUser className="role-icon client" />;
      default: return <FaUser className="role-icon client" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <div className="admin-page-content"><h2>Loading Users...</h2></div>;
  }

  return (
    <div className="admin-page-content">
      <div className="dashboard-header">
        <h1>User Management</h1>
        <p>View and manage all registered users in the system.</p>
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="form-input"
            placeholder="Search by email or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="table-container">
        <table className="content-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Date Joined</th>
              <th>Status</th>
              <th>Date Dismissed</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user._id}>
                <td>{user.email}</td>
                <td className="user-role-cell">
                  {getRoleIcon(user.role)}
                  <span>{user.role}</span>
                </td>
                <td>{formatDate(user.createdAt)}</td>
                <td>
                  <span className={`status-pill ${user.dismissedAt ? 'cancelled' : 'published'}`}>
                    {user.dismissedAt ? <FaBan /> : <FaCheckCircle />}
                    {user.dismissedAt ? 'Dismissed' : 'Active'}
                  </span>
                </td>
                <td>{formatDate(user.dismissedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;