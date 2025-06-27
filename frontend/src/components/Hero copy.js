import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section id="home" className="hero">
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">
            Healthy Meals, <span className="highlight">Anytime, Anywhere</span>
          </h1>
          <p className="hero-description">
            Discover SEA Catering's customizable healthy meal plans delivered across Indonesia. 
            From small beginnings to nationwide sensation, we're here to meet your healthy eating needs.
          </p>
          <div className="hero-buttons">
            <a href="#services" className="btn btn-primary">Explore Our Services</a>
            <a href="#contact" className="btn btn-secondary">Get Started</a>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-placeholder">
            <span>🍽️</span>
            <p>Fresh & Healthy Meals</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 