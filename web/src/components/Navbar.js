import {React, useState, useEffect, useCallback } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { useAuth } from './AuthContext';
import { debounce } from 'lodash'; // Import the debounce utility
import { FaCalendarAlt, FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';
import '../styles/navbar.css';

const Navbar = () => {
  // --- 1. State for the navbar's visual appearance (scrolled or top) ---
  const [scrolled, setScrolled] = useState(window.scrollY > 50);
  const [isMenuOpen, setMenuOpen] = useState(false);
  
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // --- 2. OPTIMIZATION: Create a debounced scroll handler ---
  // This function will only be called once the user has stopped scrolling
  // for 50 milliseconds, preventing hundreds of state updates.
  // useCallback memoizes the function so it isn't recreated on every render.
  const handleScroll = useCallback(
    debounce(() => {
      setScrolled(window.scrollY > 50);
    }, 50),
    []
  );

  // --- 3. Attach the debounced listener ---
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    // Cleanup function to remove the listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);


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

  return (
    // The className now correctly reflects the scrolled state
    <nav className={scrolled || isMenuOpen ? 'navbar scrolled' : 'navbar'}>
      <div className="navbar-container">
        <RouterLink to="/" className="navbar-logo" onClick={closeMenu}>
          <FaCalendarAlt />
          <span>Eventoria</span>
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
              <>
                <div className="user-greeting">
                  <FaUserCircle />
                  <span>{currentUser.email}</span>
                </div>
                <button className="btn-logout" onClick={handleLogout}>Logout</button>
              </>
            ) : (
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