import React from 'react';
import { FaDownload, FaChartLine, FaUsers, FaDollarSign } from 'react-icons/fa';

const AdminReports = () => {
  return (
    <div className="admin-page-content">
      <div className="dashboard-header">
        <h1>Reports</h1>
        <p>Generate financial and attendance reports for your events.</p>
      </div>

      {/* Summary Stat Cards */}
      <div className="cards-container">
        <div className="stat-card"><h4>Total Revenue</h4><p className="stat-value">$89,247</p><p className="stat-change green">+15% this month</p></div>
        <div className="stat-card"><h4>Tickets Sold (Month)</h4><p className="stat-value">932</p><p className="stat-change green">+21%</p></div>
        <div className="stat-card"><h4>New Customers</h4><p className="stat-value">128</p><p className="stat-change red">-5%</p></div>
        <div className="stat-card"><h4>Events This Quarter</h4><p className="stat-value">12</p><p className="stat-change green">+2</p></div>
      </div>

      {/* Report Generation Section */}
      <div className="reports-grid">
        <div className="report-card">
          <FaDollarSign className="report-icon" />
          <h3>Financial Report</h3>
          <p>Generate a detailed breakdown of revenue, taxes, and fees for a specific date range.</p>
          <button className="btn-primary-admin"><FaDownload /> Generate Report</button>
        </div>
        <div className="report-card">
          <FaUsers className="report-icon" />
          <h3>Attendance Report</h3>
          <p>Export a complete list of all attendees for a specific event or date range.</p>
          <button className="btn-primary-admin"><FaDownload /> Generate Report</button>
        </div>
        <div className="report-card">
          <FaChartLine className="report-icon" />
          <h3>Sales Trend Report</h3>
          <p>Visualize ticket sales over time to identify trends and peak purchasing periods.</p>
          <button className="btn-primary-admin"><FaDownload /> Generate Report</button>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;