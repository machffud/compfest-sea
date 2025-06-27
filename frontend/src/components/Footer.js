import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>SEA Catering</h3>
            <p>Healthy Meals, Anytime, Anywhere</p>
          </div>
          
          <div className="footer-links">
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Contact Info</h4>
              <ul>
                <li>Manager: Brian</li>
                <li>Phone: 08123456789</li>
                <li>Service: Nationwide</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 SEA Catering. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 