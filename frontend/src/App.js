import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Services from './components/Services';
import MealPlans from './components/MealPlans';
import Subscription from './components/Subscription';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import './App.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function AppContent() {
  const [activePage, setActivePage] = useState('home');
  const [showDashboard, setShowDashboard] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Handle scroll-based navigation highlighting
  React.useEffect(() => {
    const handleScroll = () => {
      if (showDashboard) return; // Don't change active page when dashboard is shown
      
      const sections = ['home', 'menu', 'subscription', 'testimonials', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActivePage(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showDashboard]);

  // Listen for dashboard button clicks
  React.useEffect(() => {
    const handleDashboardClick = () => {
      if (isAuthenticated) {
        setShowDashboard(true);
        setActivePage('dashboard');
      }
    };

    // Add event listener for dashboard button clicks
    const dashboardButtons = document.querySelectorAll('.nav-dashboard-btn');
    dashboardButtons.forEach(button => {
      button.addEventListener('click', handleDashboardClick);
    });

    return () => {
      dashboardButtons.forEach(button => {
        button.removeEventListener('click', handleDashboardClick);
      });
    };
  }, [isAuthenticated]);

  // Handle navigation clicks to hide dashboard
  const handleNavClick = (sectionId) => {
    setShowDashboard(false);
    setActivePage(sectionId);
    
    // Scroll to the section after a short delay to ensure dashboard is hidden
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Handle dashboard close
  const handleDashboardClose = () => {
    setShowDashboard(false);
    setActivePage('home');
  };

  if (showDashboard && isAuthenticated) {
    return (
      <div className="App">
        <Navigation activePage={activePage} onNavClick={handleNavClick} />
        <div className="dashboard-container">
          {user?.is_admin ? (
            <AdminDashboard />
          ) : (
            <UserDashboard />
          )}
          <div className="dashboard-close">
            <button onClick={handleDashboardClose} className="btn-back-to-site">
              ← Back to Site
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Navigation activePage={activePage} />
      <div id="home">
        <Hero />
      </div>
      <div id="menu">
        <Services />
        <MealPlans />
      </div>
      <div id="subscription">
        <Subscription />
      </div>
      <div id="testimonials">
        <Testimonials />
      </div>
      <div id="contact">
        <Contact />
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App; 