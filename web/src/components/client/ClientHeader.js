import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../AuthContext';
import { FaBell, FaBars } from 'react-icons/fa';
import userAvatar from '../../assets/user-avatar.png';

const mockNotifications = [
  { id: 1, message: 'Your ticket for "Annual Tech Summit" has been approved!', time: '5 minutes ago', read: false },
  { id: 2, message: 'A new event "Photography Masterclass" is now available.', time: '2 hours ago', read: false },
  { id: 3, message: 'Welcome to Eventoria!', time: '1 day ago', read: true },
];

const ClientHeader = ({ toggleSidebar }) => {
  const { currentUser } = useAuth();
  const userName = currentUser?.email.split('@')[0].replace(/\b\w/g, l => l.toUpperCase()) || 'User';

  const [notifications, setNotifications] = useState(mockNotifications);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  // --- 1. The ref is correctly defined here as 'dropdownRef' ---
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleBellClick = () => {
    setDropdownOpen(prev => !prev);
    if (!isDropdownOpen) {
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // --- 2. THE FIX: Corrected the typo from 'dropdown_ref' to 'dropdownRef' ---
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    // Add event listener when the component mounts
    document.addEventListener("mousedown", handleClickOutside);
    // Cleanup the event listener when the component unmounts
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]); // The dependency array is correct

  return (
    <header className="client-header">
      <div className="header-left">
        <button className="hamburger-btn" onClick={toggleSidebar} aria-label="Toggle Sidebar"><FaBars /></button>
        <div className="header-title">
          <h1>Welcome back, {userName}!</h1>
          <p>Here's what's happening with your tickets today.</p>
        </div>
      </div>
      
      <div className="header-right">
        {/* The ref is correctly attached to the container div */}
        <div className="notification-container" ref={dropdownRef}>
          
          
          {isDropdownOpen && (
            <div className="notification-dropdown">
              <div className="dropdown-header"><h3>Notifications</h3></div>
              <ul className="notification-list">
                {notifications.map(note => (
                  <li key={note.id} className={note.read ? 'read' : 'unread'}>
                    <p className="note-message">{note.message}</p>
                    <p className="note-time">{note.time}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="user-profile">
          <img src={userAvatar} alt="User Avatar" className="avatar" />
          <div className="user-info">
            <span className="user-name">{userName}</span>
            <span className="user-role">Premium User</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ClientHeader;