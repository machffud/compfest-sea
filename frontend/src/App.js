import React from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Services from './components/Services';
import MealPlans from './components/MealPlans';
import Subscription from './components/Subscription';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  const [activePage, setActivePage] = React.useState('home');

  // Handle scroll-based navigation highlighting
  React.useEffect(() => {
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
    <AuthProvider>
      <div className="App">
        <Navigation activePage={activePage} />
        <Hero />
        <Services />
        <MealPlans />
        <Subscription />
        <Testimonials />
        <Contact />
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App; 