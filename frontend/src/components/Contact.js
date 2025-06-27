import React from 'react';
import './Contact.css';

const Contact = () => {
  return (
    <section id="contact" className="section contact">
      <div className="container">
        <h2 className="section-title">Contact Us</h2>
        <p className="section-subtitle">
          Ready to start your healthy meal journey? Get in touch with us today!
        </p>
        
        <div className="contact-content">
          <div className="contact-info">
            <div className="contact-card">
              <div className="contact-icon">
                <span>👨‍💼</span>
              </div>
              <h3>Manager</h3>
              <p className="contact-name">Brian</p>
            </div>
            
            <div className="contact-card">
              <div className="contact-icon">
                <span>📞</span>
              </div>
              <h3>Phone Number</h3>
              <p className="contact-phone">
                <a href="tel:08123456789">08123456789</a>
              </p>
            </div>
            
            <div className="contact-card">
              <div className="contact-icon">
                <span>📍</span>
              </div>
              <h3>Service Area</h3>
              <p>Nationwide Delivery Across Indonesia</p>
            </div>
          </div>
          
          <div className="contact-message">
            <h3>Why Choose SEA Catering?</h3>
            <p>
              From our humble beginnings as a small business to becoming a nationwide sensation, 
              SEA Catering has been committed to delivering healthy, customizable meals that meet 
              your dietary needs and preferences. Our rapid growth across Indonesia is a testament 
              to our dedication to quality, freshness, and customer satisfaction.
            </p>
            <div className="contact-cta">
              <a href="tel:08123456789" className="btn btn-primary">Call Now</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact; 