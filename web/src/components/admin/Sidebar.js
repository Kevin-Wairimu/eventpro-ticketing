import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { 
  FaHome, 
  FaUsers, 
  FaCalendarAlt, 
  FaTicketAlt, 
  FaChartBar, 
  FaCog, 
  FaSignOutAlt, 
  FaTachometerAlt 
} from 'react-icons/fa';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Helper function to close the mobile sidebar overlay when a link is clicked
  const handleLinkClick = () => {
    if (isOpen) {
      toggleSidebar();
    }
  };

  // Handles the full logout process
  const handleLogout = () => {
    handleLinkClick(); // Close the mobile menu
    logout();
    navigate('/'); // Redirect to the public homepage after logout
  };

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      {/* Header section of the sidebar */}
      <div className="sidebar-header">
        <FaTachometerAlt className="logo-icon" />
        <h2 className="logo-text">Eventoria</h2>
      </div>

      {/* Main navigation links */}
      <nav className="sidebar-nav">
        <ul>
          <li><NavLink to="/admin/dashboard" className="sidebar-link" onClick={handleLinkClick}><FaHome className="nav-icon" /><span>Dashboard</span></NavLink></li>
          <li><NavLink to="/admin/users" className="sidebar-link" onClick={handleLinkClick}><FaUsers className="nav-icon" /><span>Users</span></NavLink></li>
          <li><NavLink to="/admin/events" className="sidebar-link" onClick={handleLinkClick}><FaCalendarAlt className="nav-icon" /><span>Events</span></NavLink></li>
          <li><NavLink to="/admin/tickets" className="sidebar-link" onClick={handleLinkClick}><FaTicketAlt className="nav-icon" /><span>Tickets</span></NavLink></li>
          <li><NavLink to="/admin/reports" className="sidebar-link" onClick={handleLinkClick}><FaChartBar className="nav-icon" /><span>Reports</span></NavLink></li>
        </ul>
      </nav>
      
      {/* Footer section for secondary actions */}
      <div className="sidebar-footer">
        {/* Settings Link */}
        <NavLink to="/admin/settings" className="sidebar-link" onClick={handleLinkClick}>
          <FaCog className="nav-icon" />
          <span>Settings</span>
        </NavLink>

        {/* --- NEW: Home Page Link --- */}
        {/* This link takes the admin to the public homepage without logging them out */}
        <NavLink to="/" className="sidebar-link" onClick={handleLinkClick}>
          <FaHome className="nav-icon" />
          <span>Home Page</span>
        </NavLink>

        {/* Logout Button */}
        <button onClick={handleLogout} className="sidebar-link">
          <FaSignOutAlt className="nav-icon" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;