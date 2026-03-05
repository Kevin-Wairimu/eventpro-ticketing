import React, { useState } from 'react';
import { FaUserCog, FaShieldAlt, FaBell, FaPalette, FaCheckCircle } from 'react-icons/fa';
import '../../styles/clientDashboard.css';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [success, setSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="client-dashboard-overview">
      <div className="dashboard-header">
        <h1>Account Settings</h1>
        <p>Manage your account preferences and notification settings.</p>
      </div>

      <div className="dashboard-main-grid" style={{ gridTemplateColumns: '250px 1fr' }}>
        {/* Settings Navigation */}
        <div className="side-panel">
          <div className="action-card" style={{ padding: '1rem' }}>
            <button 
              className={`sidebar-link ${activeTab === 'account' ? 'active' : ''}`} 
              onClick={() => setActiveTab('account')}
              style={{ width: '100%', border: 'none', cursor: 'pointer', background: 'none', textAlign: 'left' }}
            >
              <FaUserCog /> Account
            </button>
            <button 
              className={`sidebar-link ${activeTab === 'security' ? 'active' : ''}`} 
              onClick={() => setActiveTab('security')}
              style={{ width: '100%', border: 'none', cursor: 'pointer', background: 'none', textAlign: 'left' }}
            >
              <FaShieldAlt /> Security
            </button>
            <button 
              className={`sidebar-link ${activeTab === 'notifications' ? 'active' : ''}`} 
              onClick={() => setActiveTab('notifications')}
              style={{ width: '100%', border: 'none', cursor: 'pointer', background: 'none', textAlign: 'left' }}
            >
              <FaBell /> Notifications
            </button>
          </div>
        </div>

        {/* Settings Content */}
        <div className="spotlight-card">
          {success && (
            <div className="status-pill approved" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', width: 'fit-content' }}>
              <FaCheckCircle /> Changes saved successfully!
            </div>
          )}

          {activeTab === 'account' && (
            <form onSubmit={handleSave}>
              <h3>Profile Settings</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' }}>Update your personal information and how others see you.</p>
              
              <div className="form-group">
                <label className="form-label">Display Name</label>
                <input type="text" className="form-input" placeholder="Enter your name" />
              </div>
              
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-input" placeholder="your@email.com" />
              </div>

              <div className="form-group">
                <label className="form-label">Language</label>
                <select className="form-input">
                  <option>English (UK)</option>
                  <option>Swahili</option>
                  <option>French</option>
                </select>
              </div>

              <button type="submit" className="btn-primary-action" style={{ marginTop: '1rem' }}>Save Changes</button>
            </form>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handleSave}>
              <h3>Security & Privacy</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' }}>Manage your password and two-factor authentication.</p>
              
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input type="password" className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input type="password" className="form-input" />
              </div>
              
              <div className="form-group" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#f8fafc', borderRadius: '12px' }}>
                <div>
                  <p style={{ fontWeight: '600', margin: 0 }}>Two-Factor Authentication</p>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>Add an extra layer of security to your account.</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" />
                  <span className="slider"></span>
                </label>
              </div>

              <button type="submit" className="btn-primary-action" style={{ marginTop: '1.5rem' }}>Update Security</button>
            </form>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h3>Notification Preferences</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' }}>Control which updates you receive and how.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {['Event Reminders', 'Ticket Approvals', 'New Event Alerts', 'Marketing Emails'].map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ fontWeight: '500' }}>{item}</span>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked={i < 2} />
                      <span className="slider"></span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
