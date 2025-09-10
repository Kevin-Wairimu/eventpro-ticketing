import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
// --- 1. Import the useAuth hook ---
import { useAuth } from './AuthContext';
import { FaCalendarAlt, FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';
import '../styles/navbar.css';

const Navbar = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  // --- 2. Get the current user and logout function from the context ---
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  const toggleMenu = () => setMenuOpen(!isMenuOpen);
  const closeMenu = () => setMenuOpen(false);

  // --- 3. Create a function to handle the logout process ---
  const handleLogout = () => {
    closeMenu();
    logout();
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <RouterLink to="/" className="navbar-logo" onClick={closeMenu}><FaCalendarAlt /><span>Eventoria</span></RouterLink>
        <button className="menu-icon" onClick={toggleMenu} aria-label="Toggle menu">{isMenuOpen ? <FaTimes /> : <FaBars />}</button>
        <div className={isMenuOpen ? 'nav-content-wrapper active' : 'nav-content-wrapper'}>
          <ul className="nav-menu-list">
            <li><HashLink smooth to="/#landingpage" className="nav-links" onClick={closeMenu}>Home</HashLink></li>
            <li><HashLink smooth to="/#about" className="nav-links" onClick={closeMenu}>About</HashLink></li>
            <li><HashLink smooth to="/#contact" className="nav-links" onClick={closeMenu}>Contact</HashLink></li>
          </ul>
          
          {/* --- 4. CRITICAL: Conditional Rendering Logic --- */}
          <div className="nav-actions">
            {currentUser ? (
              // If a user IS logged in, show their email and a Logout button
              <>
                <div className="user-greeting">
                  <FaUserCircle />
                  <span>{currentUser.email}</span>
                </div>
                <button className="btn-logout" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              // If NO user is logged in, show the Login and Register buttons
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