import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaQuestionCircle } from 'react-icons/fa';
import { BsFillCalendarEventFill } from 'react-icons/bs';
import '../styles/footer.css';

const Footer = () => {
  return (
    <footer className="footer" id="contact">
      <div className="footer-content">
        <div className="footer-section about">
          <h1 className="logo-text">
            <BsFillCalendarEventFill className="logo-icon" />
            <span>Eventoria</span>
          </h1>
          <p>
            Creating unforgettable experiences and bringing people together
            through exceptional event management since 2015.
          </p>
          <div className="socials">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaLinkedinIn /></a>
          </div>
        </div>

        <div className="footer-section links">
          <h2>Services</h2>
          <ul>
            <li><a href="#">Corporate Events</a></li>
            <li><a href="#">Conferences</a></li>
            <li><a href="#">Festivals</a></li>
            <li><a href="#">Private Parties</a></li>
          </ul>
        </div>

        <div className="footer-section links">
          <h2>Company</h2>
          <ul>
            <li><a href="#about">About Us</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>

        <div className="footer-section contact-info">
          <h2>Contact Info</h2>
          <div className="contact-item">
            <FaMapMarkerAlt />
            <span>123 Main Street, Naiirobi, 00100</span>
          </div>
          <div className="contact-item">
            <FaPhoneAlt />
            <span>0757724175</span>
          </div>
          <div className="contact-item">
            <FaEnvelope />
            <span>Eventoria@eventpro.com</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 EventPro. All rights reserved. | <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a></p>
      </div>

      
    </footer>
  );
};

export default Footer;