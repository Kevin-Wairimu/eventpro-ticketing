import React, { useState, useRef } from 'react';
import { useAuth } from '../AuthContext';
import userAvatar from '../../assets/user-avatar.png'; // Default avatar

const ClientProfilePage = () => {
  // --- Get the current user and the NEW updateUser function from context ---
  const { currentUser, updateUser } = useAuth();
  
  // State to manage the form fields, pre-filled with the current user's data
  const [fullName, setFullName] = useState(currentUser.fullName || currentUser.email.split('@')[0].replace(/\b\w/g, l => l.toUpperCase()));
  const [email, setEmail] = useState(currentUser.email);
  
  // The avatar state now prioritizes the saved avatar, then the default
  const [avatarPreview, setAvatarPreview] = useState(currentUser.avatar || userAvatar);
  
  // This will hold the raw file data to be "uploaded"
  const [avatarFile, setAvatarFile] = useState(null);

  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create an object with the data we want to save
    const updatedData = {
      fullName: fullName,
    };

    // If a new avatar file was selected, convert it to base64 and add to the update
    if (avatarFile) {
      const reader = new FileReader();
      reader.readAsDataURL(avatarFile);
      reader.onloadend = () => {
        // The result is a base64 string representing the image
        updatedData.avatar = reader.result;
        // Update the user in the context and localStorage
        updateUser(updatedData);
        alert("Profile and new avatar saved successfully!");
      };
    } else {
      // If no new avatar, just update the name
      updateUser(updatedData);
      alert("Profile saved successfully!");
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Save the file object for later conversion on submit
      setAvatarFile(file);
      // Create a temporary URL to preview the selected image instantly
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="client-page-container">
      <div className="dashboard-welcome">
        <h1>My Profile</h1>
        <p>View and manage your personal information.</p>
      </div>

      <form className="settings-form" onSubmit={handleSubmit}>
        <div className="form-card">
          <div className="profile-header">
            <img src={avatarPreview} alt="User Avatar" className="avatar-large" />
            <div className="profile-info">
              <h3>{fullName}</h3>
              <p>{email}</p>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleFileChange} 
              accept="image/png, image/jpeg"
            />
            <button type="button" className="btn-secondary-action" onClick={handleUploadClick}>
              Change Photo
            </button>
          </div>
          
          <hr className="form-divider" />

          <h2>Personal Information</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="fullName" className="form-label">Full Name</label>
              <input 
                type="text" 
                id="fullName" 
                className="form-input" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input 
                type="email" 
                id="email" 
                className="form-input" 
                value={email}
                readOnly 
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary-action">Save Changes</button>
        </div>
      </form>
    </div>
  );
};

export default ClientProfilePage;