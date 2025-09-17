import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../api/api'; // Your API instance for future integration

const AdminSettings = () => {
  // --- State to manage all form inputs ---
  // In a real app, you would fetch these initial values from a GET /api/settings endpoint.
  const [siteName, setSiteName] = useState("Eventoria");
  const [contactEmail, setContactEmail] = useState("contact@eventoria.com");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const settingsData = {
        siteName,
        contactEmail,
        security: {
          twoFactorEnabled,
        },
      };
      
      // --- Simulate an API call to save the settings ---
      // In a real app, this would be: await api.put('/settings', settingsData);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulates a 1-second network delay

      toast.success("Settings saved successfully!");

    } catch (error) {
      toast.error("Failed to save settings. Please try again.");
      console.error("Error saving settings:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page-content">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} theme="colored" />
      <div className="dashboard-header">
        <h1>Settings</h1>
        <p>Configure application settings, integrations, and branding.</p>
      </div>

      <form className="settings-form" onSubmit={handleSubmit}>
        {/* --- General Settings Card --- */}
        <div className="form-card">
          <h2>General Settings</h2>
          <div className="form-group">
            <label htmlFor="siteName" className="form-label">Site Name</label>
            <input 
              type="text" 
              id="siteName" 
              className="form-input" 
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="contactEmail" className="form-label">Public Contact Email</label>
            <input 
              type="email" 
              id="contactEmail" 
              className="form-input" 
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
            />
          </div>
        </div>

        {/* --- Security Settings Card --- */}
        <div className="form-card">
          <h2>Security</h2>
          <div className="form-group-toggle">
            <label htmlFor="twoFactor" className="form-label">Enable Two-Factor Authentication for Admins</label>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                id="twoFactor" 
                checked={twoFactorEnabled}
                onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        {/* --- Branding Settings Card --- */}
        <div className="form-card">
          <h2>Branding</h2>
          <div className="form-group">
            <label htmlFor="logoUpload" className="form-label">Upload Logo</label>
            <input type="file" id="logoUpload" className="form-input" />
            <p className="form-hint">Upload a PNG or SVG file. Max size: 2MB.</p>
          </div>
        </div>

        {/* --- Form Actions --- */}
        <div className="form-actions">
          <button type="submit" className="btn-primary-admin" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;