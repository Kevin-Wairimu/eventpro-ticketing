import React, { useState, useEffect, useRef } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { useAuth } from './AuthContext';
import { FaCalendarAlt, FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';
import '../styles/navbar.css';

// --- NEW: Custom hook for Intersection Observer ---
const useScrollObserver = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // The hero section is our target. The navbar will become solid when this is not visible.
    const heroElement = document.querySelector('.hero'); 
    if (!heroElement) return;

    // Create an observer that will fire a callback when the hero section
    // is no longer intersecting (visible) at the top of the viewport.
    const observer = new IntersectionObserver(
      ([entry]) => {
        // isIntersecting will be false when the element is off-screen.
        setScrolled(!entry.isIntersecting);
      },
      // We set a rootMargin of -80px. This means the callback will fire
      // when the hero section is 80px *above* the top of the viewport,
      // giving a smooth transition exactly when the navbar is over content.
      { rootMargin: '-80px 0px 0px 0px', threshold: 0 }
    );

    // Start observing the hero element
    observer.observe(heroElement);

    // Clean up the observer when the component unmounts
    return () => observer.disconnect();
  }, []); // Run this effect only once on mount

  return scrolled;
};


const Navbar = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  // --- UPDATED: Use our new custom hook ---
  const scrolled = useScrollObserver();

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
    <nav className={scrolled || isMenuOpen ? 'navbar scrolled' : 'navbar'}>
      <div className="navbar-container">
        <RouterLink to="/" className="navbar-logo" onClick={closeMenu}><FaCalendarAlt /><span>Eventoria</span></RouterLink>
        <button className="menu-icon" onClick={toggleMenu} aria-label="Toggle menu">{isMenuOpen ? <FaTimes /> : <FaBars />}</button>
        <div className={isMenuOpen ? 'nav-content-wrapper active' : 'nav-content-wrapper'}>
          <ul className="nav-menu-list">
            <li><HashLink smooth to="/#landingpage" className="nav-links" onClick={closeMenu}>Home</HashLink></li>
            <li><HashLink smooth to="/#about" className="nav-links" onClick={closeMenu}>About</HashLink></li>
            <li><HashLink smooth to="/#contact" className="nav-links" onClick={closeMenu}>Contact</HashLink></li>
          </ul>
          <div className="nav-actions">
            {currentUser ? (
              <>
                <div className="user-greeting"><FaUserCircle /><span>{currentUser.email}</span></div>
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