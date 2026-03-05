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
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <main className="admin-main-content">
        <div className="mobile-header" style={{ display: 'none', padding: '1rem', borderBottom: '1px solid var(--border-color)', background: 'white' }}>
          <button onClick={toggleSidebar} className="hamburger-btn" aria-label="Toggle sidebar" style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>
            <FaBars />
          </button>
        </div>
        {isSidebarOpen && <div className="overlay" onClick={toggleSidebar} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999 }}></div>}
        
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;