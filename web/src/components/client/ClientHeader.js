import React from 'react';
import { useAuth } from '../AuthContext';
import { FaBell, FaBars, FaSearch } from 'react-icons/fa';
import userAvatar from '../../assets/user-avatar.png';

const ClientHeader = ({ toggleSidebar }) => {
  const { currentUser } = useAuth();
  const userName = currentUser?.email.split('@')[0] || 'User';

  return (
    <header className="client-header">
      <div className="header-left">
        <button className="hamburger-btn" onClick={toggleSidebar}>
          <FaBars />
        </button>
        <div className="header-search">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search for events..." />
        </div>
      </div>
      
      <div className="header-right">
        <button className="notification-btn" title="Notifications">
          <FaBell />
          <span className="notification-badge"></span>
        </button>
        
        <div className="user-profile-header">
          <div className="user-text">
            <span className="user-name">{userName}</span>
            <span className="user-role">Account: {currentUser?.role || 'Client'}</span>
          </div>
          <img src={userAvatar} alt="Profile" className="header-avatar" />
        </div>
      </div>
    </header>
  );
};

export default ClientHeader;
