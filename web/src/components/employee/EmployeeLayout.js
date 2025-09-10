import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import EmployeeSidebar from './EmployeeSidebar';
import EmployeeHeader from './EmployeeHeader';
import '../../styles/employeeDashboard.css';

const EmployeeLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className="employee-layout">
      <EmployeeSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="employee-main-content">
        <EmployeeHeader toggleSidebar={toggleSidebar} />
        <div className="employee-page-content">
          <Outlet /> {/* Child pages like Overview, Clients, etc., will render here */}
        </div>
      </div>
      {/* This overlay is for closing the mobile menu by clicking outside of it */}
      {isSidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}
    </div>
  );
};

export default EmployeeLayout;