import React, { useState, useEffect } from 'react';
import './App.css';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Services from './components/Services';
import Contact from './components/Contact';
import MealPlans from './components/MealPlans';

function App() {
  const [activePage, setActivePage] = useState('home');

  // Handle scroll-based navigation highlighting
  useEffect(() => {
    const handleScroll = () => {
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
  }, []);

  return (
    <div className="App">
      <Navigation activePage={activePage} />
      <Hero />
      <Services />
      <MealPlans />
      {/* <Subscription />
      <Testimonials /> */}
      <Contact />
      <Footer />
    </div>
  );
}

export default App; 