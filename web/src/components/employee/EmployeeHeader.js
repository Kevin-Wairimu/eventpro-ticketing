import React from 'react';
import { useAuth } from '../AuthContext';
import { FaBell, FaBars } from 'react-icons/fa';
import userAvatar from '../../assets/user-avatar.png'; // Make sure you have a placeholder avatar

const EmployeeHeader = ({ toggleSidebar }) => {
  const { currentUser } = useAuth();
  const userName = currentUser?.email.split('@')[0].replace(/\b\w/g, l => l.toUpperCase()) || 'Employee';

  return (
    <header className="employee-header">
      <div className="header-left">
        <button className="hamburger-btn" onClick={toggleSidebar} aria-label="Toggle Sidebar"><FaBars /></button>
        <div className="header-title">
          <h1>Employee Dashboard</h1>
          <p>Monitor clients and manage new user registrations</p>
        </div>
      </div>
      <div className="header-right">
        <div className="notification-icon">
          <FaBell />
          <span className="notification-dot"></span>
        </div>
        <div className="user-profile">
          <img src={userAvatar} alt="User Avatar" className="avatar" />
          <div className="user-info">
            <span className="user-name">{userName}</span>
            <span className="user-role">{currentUser?.role}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default EmployeeHeader;