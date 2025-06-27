import React, { useState } from 'react';
import './Navigation.css';

const Navigation = ({ activePage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'home', label: 'Home', href: '#home' },
    { id: 'menu', label: 'Menu / Meal Plans', href: '#menu' },
    { id: 'subscription', label: 'Subscription', href: '#subscription' },
    { id: 'contact', label: 'Contact Us', href: '#contact' }
  ];

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <h1 className="brand-name">SEA Catering</h1>
        </div>

        {/* Mobile menu button */}
        <button 
          className={`mobile-menu-button ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation menu */}
        <ul className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          {navItems.map((item) => (
            <li key={item.id}>
              <a 
                href={item.href}
                className={`nav-link ${activePage === item.id ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation; 