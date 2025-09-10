import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api'; // Import your API instance
import { FaCalendarAlt, FaEnvelope, FaLock } from 'react-icons/fa';
import '../styles/register.css'; // Use a shared stylesheet for Login and Register

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Note: We don't need useAuth here, as we are not setting a user session on register.

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Send the new user's details to the backend register endpoint.
      // We are creating a 'client' user by default from the public registration.
      const response = await api.post('/auth/register', { email, password, role: 'client' });

      // 2. Check for a successful response from the server.
      if (response.status === 201) {
        // 3. Success! Redirect the user to the login page to sign in.
        navigate('/login');
      } else {
        throw new Error(response.data.message || "Registration failed.");
      }

    } catch (err) {
      // This will catch backend errors (like "User already exists") or network errors.
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      setLoading(false); // Re-enable the button so the user can try again.
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <FaCalendarAlt className="logo-icon" />
          <h1>Eventoria</h1>
        </div>
        
        <h2>Create Your Account</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <FaEnvelope className="input-icon" />
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          
          <div className="form-group">
            <FaLock className="input-icon" />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              minLength="6" // Add a minimum password length for better security
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Registering..." : "Create Account"}
          </button>
        </form>
        
        <div className="switch-auth">
          <p>Already have an account? <Link to="/login">Login Here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;