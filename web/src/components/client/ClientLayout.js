import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import ClientSidebar from './ClientSidebar';
import ClientHeader from './ClientHeader';
import '../../styles/clientDashboard.css';

const ClientLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className="client-layout">
      <ClientSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="client-main-content">
        <ClientHeader toggleSidebar={toggleSidebar} />
        <div className="client-page-content">
          <Outlet /> {/* Child pages will render here */}
        </div>
      </div>
      {isSidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}
    </div>
  );
};

export default ClientLayout;