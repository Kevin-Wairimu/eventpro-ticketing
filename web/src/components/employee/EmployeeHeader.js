import React from 'react';
import { useAuth } from '../AuthContext';
import { FaBell, FaBars } from 'react-icons/fa';
import userAvatar from '../../assets/user-avatar.png';

const EmployeeHeader = ({ toggleSidebar }) => {
  const { currentUser } = useAuth();
  const userName = currentUser?.email.split('@')[0].replace(/\b\w/g, l => l.toUpperCase()) || 'Employee';

  return (
    <header className="employee-header">
      <div className="header-left">
        <button className="hamburger-btn" onClick={toggleSidebar} aria-label="Toggle Sidebar"><FaBars /></button>
        <div className="header-title">
          <h1>Welcome, {userName}!</h1>
          <p>Here's your daily overview.</p>
        </div>
      </div>
      
      <div className="header-right">
        <button className="notification-icon" title="Notifications">
          <FaBell />
          <span className="notification-dot"></span>
        </button>
        
        <div className="user-profile">
          <div className="user-info">
            <span className="user-name">{userName}</span>
            <span className="user-role">Staff Member</span>
          </div>
          <img src={userAvatar} alt="User Avatar" className="avatar" />
        </div>
      </div>
    </header>
  );
};

export default EmployeeHeader;
