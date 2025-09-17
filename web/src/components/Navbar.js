import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { useAuth } from './AuthContext';
import { FaCalendarAlt, FaBars, FaTimes, FaTachometerAlt } from 'react-icons/fa';
import '../styles/navbar.css';

const Navbar = () => {
  const [isMenuOpen, setMenuOpen] = useState (false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // Effect to lock body scroll when the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  const toggleMenu = () => setMenuOpen(!isMenuOpen);
  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    closeMenu();
    logout();
    navigate('/login');
  };
  
  // --- THIS IS THE CRITICAL FIX ---
  // A new helper function that checks the current user's role
  // and returns the correct path to their specific dashboard.
  const getDashboardPath = () => {
    // If for some reason there is no user, default to the homepage.
    if (!currentUser) return '/';
    
    switch (currentUser.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'employee':
        return '/employee/overview';
      case 'client':
        return '/client/dashboard';
      default:
        // A safe fallback in case of an unknown role.
        return '/';
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <RouterLink to="/" className="navbar-logo" onClick={closeMenu}>
          <FaCalendarAlt /><span>Eventoria</span>
        </RouterLink>
        <button className="menu-icon" onClick={toggleMenu} aria-label="Toggle menu">
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
        
        <div className={isMenuOpen ? 'nav-content-wrapper active' : 'nav-content-wrapper'}>
          <ul className="nav-menu-list">
            <li><HashLink smooth to="/#landingpage" className="nav-links" onClick={closeMenu}>Home</HashLink></li>
            <li><HashLink smooth to="/#about" className="nav-links" onClick={closeMenu}>About</HashLink></li>
            <li><HashLink smooth to="/#contact" className="nav-links" onClick={closeMenu}>Contact</HashLink></li>
          </ul>
          
          <div className="nav-actions">
            {currentUser ? (
              // This is the "logged in" view
              <>
                {/* --- The 'to' prop now dynamically calls our new helper function --- */}
                <RouterLink to={getDashboardPath()} className="btn-dashboard" onClick={closeMenu}>
                  <FaTachometerAlt /> My Dashboard
                </RouterLink>
                <button className="btn-logout" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              // This is the "logged out" view
              <>
                <RouterLink to="/login" className="btn-login" onClick={closeMenu}>Login</RouterLink>
                <RouterLink to="/register" className="btn-register" onClick={closeMenu}>Register</RouterLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;