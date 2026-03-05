import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { FaTachometerAlt, FaUsers, FaUserPlus, FaChartLine, FaCog, FaSignOutAlt, FaHome } from 'react-icons/fa';

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
        <div className="logo-icon-wrapper"><FaTachometerAlt /></div>
        <div className="logo-text">
          <h2>Dashboard</h2>
          <span>Employee Portal</span>
        </div>
      </div>
      <nav className="employee-sidebar-nav">
        <ul>
          <li><NavLink to="/employee/overview" className={({isActive}) => isActive ? 'active' : ''} onClick={closeMenu}><FaTachometerAlt className="nav-icon" /><span>Overview</span></NavLink></li>
          <li><NavLink to="/employee/clients" className={({isActive}) => isActive ? 'active' : ''} onClick={closeMenu}><FaUsers className="nav-icon" /><span>Clients</span></NavLink></li>
          <li><NavLink to="/employee/new-users" className={({isActive}) => isActive ? 'active' : ''} onClick={closeMenu}><FaUserPlus className="nav-icon" /><span>New Users</span></NavLink></li>
          <li><NavLink to="/employee/analytics" className={({isActive}) => isActive ? 'active' : ''} onClick={closeMenu}><FaChartLine className="nav-icon" /><span>Analytics</span></NavLink></li>
          <div className="sidebar-divider" style={{height: '1px', background: 'rgba(255,255,255,0.1)', margin: '1.5rem 1rem'}}></div>
          <li><NavLink to="/" onClick={closeMenu}><FaHome className="nav-icon" /><span>Back to Home</span></NavLink></li>
        </ul>
      </nav>
      <div className="sidebar-footer">
        <NavLink to="/employee/settings" onClick={closeMenu}><FaCog className="nav-icon" /><span>Settings</span></NavLink>
        <button onClick={handleLogout} className="sidebar-logout-btn">
          <FaSignOutAlt className="nav-icon" /><span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default EmployeeSidebar;
