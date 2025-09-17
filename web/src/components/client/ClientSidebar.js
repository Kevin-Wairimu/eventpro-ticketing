import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
// --- 1. Import the FaHome icon ---
import { FaTachometerAlt, FaUser, FaCog, FaSignOutAlt, FaHome } from 'react-icons/fa';

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
      <div className="client-sidebar-header">
        <div className="logo-icon-wrapper">E</div>
        <div className="logo-text">
          <h2>Eventoria</h2>
          <span>Client Portal</span>
        </div>
      </div>
      <nav className="client-sidebar-nav">
        <ul>
          <li><NavLink to="/client/dashboard" onClick={closeMenu}><FaTachometerAlt /><span>Dashboard</span></NavLink></li>
          <li><NavLink to="/client/profile" onClick={closeMenu}><FaUser /><span>My Profile</span></NavLink></li>
          
          {/* --- 2. ADDED: The new Home button link --- */}
          {/* It uses a standard NavLink that points to the root path "/" */}
          <li>
            <NavLink to="/" onClick={closeMenu}>
              <FaHome />
              <span>Home Page</span>
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="sidebar-footer">
        <NavLink to="/client/settings" onClick={closeMenu}><FaCog /><span>Settings</span></NavLink>
        <button onClick={handleLogout} className="sidebar-logout-btn"><FaSignOutAlt /><span>Logout</span></button>
      </div>
    </aside>
  );
};

export default ClientSidebar;