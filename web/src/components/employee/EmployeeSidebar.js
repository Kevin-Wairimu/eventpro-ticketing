import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { FaTachometerAlt, FaUsers, FaUserPlus, FaChartLine, FaCog, FaSignOutAlt } from 'react-icons/fa';

const EmployeeSidebar = ({ isOpen, toggleSidebar }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const closeMenu = () => { if (isOpen) toggleSidebar(); };

  const handleLogout = () => {
    closeMenu();
    logout();
    navigate('/login');
  };

  return (
    <aside className={`employee-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="employee-sidebar-header">
        <div className="logo-icon-wrapper"><FaTachometerAlt className="logo-icon" /></div>
        <div className="logo-text">
          <h2>Dashboard</h2>
          <span>Employee Portal</span>
        </div>
      </div>
      <nav className="employee-sidebar-nav">
        <ul>
          <li><NavLink to="/employee/overview" onClick={closeMenu}><FaTachometerAlt /><span>Overview</span></NavLink></li>
          <li><NavLink to="/employee/clients" onClick={closeMenu}><FaUsers /><span>Clients</span></NavLink></li>
          <li><NavLink to="/employee/new-users" onClick={closeMenu}><FaUserPlus /><span>New Users</span></NavLink></li>
          <li><NavLink to="/employee/analytics" onClick={closeMenu}><FaChartLine /><span>Analytics</span></NavLink></li>
        </ul>
      </nav>
      <div className="sidebar-footer">
        <NavLink to="/employee/settings" onClick={closeMenu}><FaCog /><span>Settings</span></NavLink>
        <button onClick={handleLogout} className="sidebar-logout-btn">
          <FaSignOutAlt /><span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default EmployeeSidebar;