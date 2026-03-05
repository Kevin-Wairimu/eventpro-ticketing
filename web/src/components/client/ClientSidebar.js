import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { FaTachometerAlt, FaUser, FaCog, FaSignOutAlt, FaHome, FaHistory, FaTicketAlt } from 'react-icons/fa';

const ClientSidebar = ({ isOpen, toggleSidebar }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const closeMenu = () => { if (isOpen) toggleSidebar(); };

  const handleLogout = () => {
    closeMenu();
    logout();
    navigate('/login');
  };

  return (
    <aside className={`client-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-brand">
        <div className="logo-icon-wrapper">E</div>
        <div className="logo-text">
          <h2>Eventoria</h2>
          <span>Client Portal</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/client/dashboard" className={({isActive}) => isActive ? 'sidebar-link active' : 'sidebar-link'} onClick={closeMenu}>
              <FaTachometerAlt className="nav-icon" />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/client/tickets" className={({isActive}) => isActive ? 'sidebar-link active' : 'sidebar-link'} onClick={closeMenu}>
              <FaTicketAlt className="nav-icon" />
              <span>My Tickets</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/client/history" className={({isActive}) => isActive ? 'sidebar-link active' : 'sidebar-link'} onClick={closeMenu}>
              <FaHistory className="nav-icon" />
              <span>Purchase History</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/client/profile" className={({isActive}) => isActive ? 'sidebar-link active' : 'sidebar-link'} onClick={closeMenu}>
              <FaUser className="nav-icon" />
              <span>Profile</span>
            </NavLink>
          </li>
          <div className="sidebar-divider"></div>
          <li>
            <NavLink to="/" className="sidebar-link" onClick={closeMenu}>
              <FaHome className="nav-icon" />
              <span>Back to Home</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/client/settings" className="sidebar-link" onClick={closeMenu}>
          <FaCog className="nav-icon" />
          <span>Settings</span>
        </NavLink>
        <button onClick={handleLogout} className="sidebar-link logout-btn">
          <FaSignOutAlt className="nav-icon" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default ClientSidebar;
