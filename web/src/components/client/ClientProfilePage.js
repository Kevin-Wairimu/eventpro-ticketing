import React from 'react';
import { useAuth } from '../AuthContext';
import { FaUserEdit, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaShieldAlt } from 'react-icons/fa';
import '../../styles/clientDashboard.css';

const ClientProfilePage = () => {
  const { currentUser } = useAuth();

  return (
    <div className="client-dashboard-overview">
      <div className="dashboard-header">
        <h1>My Profile</h1>
        <p>Manage your personal information and preferences.</p>
      </div>

      <div className="dashboard-main-grid">
        <div className="spotlight-card">
          <div className="card-header-flex">
            <h3>Personal Information</h3>
            <button className="btn-secondary-sm"><FaUserEdit /> Edit</button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="form-input" style={{ background: '#f8fafc', color: '#1e293b' }}>
                {currentUser?.email.split('@')[0]}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="form-input" style={{ background: '#f8fafc', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaEnvelope style={{ color: '#94a3b8' }} /> {currentUser?.email}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <div className="form-input" style={{ background: '#f8fafc', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaPhoneAlt style={{ color: '#94a3b8' }} /> Not Provided
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <div className="form-input" style={{ background: '#f8fafc', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaMapMarkerAlt style={{ color: '#94a3b8' }} /> Nairobi, Kenya
              </div>
            </div>
          </div>
        </div>

        <div className="side-panel">
          <div className="action-card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaShieldAlt /> Security</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Keep your account secure by updating your password regularly.</p>
            <button className="btn-primary-action" style={{ width: '100%', justifyContent: 'center' }}>Change Password</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProfilePage;
