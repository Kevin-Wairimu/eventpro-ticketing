import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
// Make sure this import is correct
import Sidebar from './Sidebar'; 
import '../../styles/adminDashboard.css';

const AdminLayout = () => {
  // --- 1. State for the sidebar is correctly defined here ---
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="admin-layout">
      {/* --- 2. THE FIX: Pass the state and function down as props --- */}
      {/* The Sidebar component needs to receive 'isOpen' and 'toggleSidebar' */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <main className="main-content">
        <div className="mobile-header">
          <button onClick={toggleSidebar} className="hamburger-btn" aria-label="Toggle sidebar">
            <FaBars />
          </button>
        </div>
        {/* The overlay also needs the toggle function to close the menu */}
        {isSidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}
        
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;