import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
// --- CRITICAL FIX: Corrected the import path for the api instance ---
// This path assumes your api.js file is in 'src/api.js'
import api from '../api/api'; 
import { FaCalendarAlt, FaEnvelope, FaLock } from 'react-icons/fa';
import '../styles/login.css'; // Use a shared auth stylesheet

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, redirectPath, setRedirectPath } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { accessToken, user } = response.data;
      if (accessToken && user) {
        localStorage.setItem('accessToken', accessToken);
        login(user);

        if (redirectPath) {
          navigate(redirectPath.path, { state: redirectPath.state });
          setRedirectPath(null);
        } else {
          switch (user.role) {
            case "admin": navigate("/admin/dashboard"); break;
            case "employee": navigate("/employee/overview"); break;
            case "client": navigate("/client/dashboard"); break;
            default: navigate("/");
          }
        }
      } else {
        throw new Error("Invalid response from server.");
      }
    } catch (err) {
      setError("The email or password you entered is incorrect. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <FaCalendarAlt className="logo-icon" /><h1>Eventoria</h1>
        </div>
        <h2>Sign In to Your Account</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <FaEnvelope className="input-icon" /><input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <FaLock className="input-icon" /><input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
        <div className="switch-auth"><p>Don't have an account? <Link to="/register">Register Here</Link></p></div>
      </div>
    </div>
  );
};

export default Login;