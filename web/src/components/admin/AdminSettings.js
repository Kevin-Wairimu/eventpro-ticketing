import React from 'react';

const AdminSettings = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would handle form submission here
    alert("Settings saved successfully!");
  };

  return (
    <div className="admin-page-content">
      <div className="dashboard-header">
        <h1>Settings</h1>
        <p>Configure application settings, integrations, and branding.</p>
      </div>

      <form className="settings-form" onSubmit={handleSubmit}>
        <div className="form-card">
          <h2>General Settings</h2>
          <div className="form-group">
            <label htmlFor="siteName" className="form-label">Site Name</label>
            <input type="text" id="siteName" className="form-input" defaultValue="Eventoria" />
          </div>
          <div className="form-group">
            <label htmlFor="contactEmail" className="form-label">Public Contact Email</label>
            <input type="email" id="contactEmail" className="form-input" defaultValue="contact@eventoria.com" />
          </div>
        </div>

        <div className="form-card">
          <h2>Security</h2>
          <div className="form-group-toggle">
            <label htmlFor="twoFactor" className="form-label">Enable Two-Factor Authentication for Admins</label>
            <label className="toggle-switch">
              <input type="checkbox" id="twoFactor" defaultChecked />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        <div className="form-card">
          <h2>Branding</h2>
          <div className="form-group">
            <label htmlFor="logoUpload" className="form-label">Upload Logo</label>
            <input type="file" id="logoUpload" className="form-input" />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary-admin">Save Changes</button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;