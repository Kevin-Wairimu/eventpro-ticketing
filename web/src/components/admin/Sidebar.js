import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; 
import { FaHome, FaUsers, FaCalendarAlt, FaTicketAlt, FaChartBar, FaCog, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLinkClick = () => { if (isOpen) toggleSidebar(); };
  const handleLogout = () => { handleLinkClick(); logout(); navigate('/'); };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <FaTachometerAlt className="logo-icon" />
        <h2 className="logo-text">Eventoria</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {/* Apply the shared 'sidebar-link' class to all NavLinks */}
          <li><NavLink to="/admin/dashboard" className="sidebar-link" onClick={handleLinkClick}><FaHome className="nav-icon" /><span>Dashboard</span></NavLink></li>
          <li><NavLink to="/admin/users" className="sidebar-link" onClick={handleLinkClick}><FaUsers className="nav-icon" /><span>Users</span></NavLink></li>
          <li><NavLink to="/admin/events" className="sidebar-link" onClick={handleLinkClick}><FaCalendarAlt className="nav-icon" /><span>Events</span></NavLink></li>
          <li><NavLink to="/admin/tickets" className="sidebar-link" onClick={handleLinkClick}><FaTicketAlt className="nav-icon" /><span>Tickets</span></NavLink></li>
          <li><NavLink to="/admin/reports" className="sidebar-link" onClick={handleLinkClick}><FaChartBar className="nav-icon" /><span>Reports</span></NavLink></li>
          <li><NavLink to="/admin/settings" className="sidebar-link" onClick={handleLinkClick}><FaCog className="nav-icon" /><span>Settings</span></NavLink></li>
        </ul>
      </nav>
      <div className="sidebar-footer">
        {/* Apply the shared 'sidebar-link' class to the button */}
        <button onClick={handleLogout} className="sidebar-link">
          <FaSignOutAlt className="nav-icon" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;