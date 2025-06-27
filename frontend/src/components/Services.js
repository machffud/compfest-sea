import React from 'react';
import './Services.css';

const Services = () => {
  const services = [
    {
      icon: '🍽️',
      title: 'Meal Customization',
      description: 'Personalize your meals according to your dietary preferences, allergies, and nutritional goals.'
    },
    {
      icon: '🚚',
      title: 'Nationwide Delivery',
      description: 'Fast and reliable delivery service to major cities across Indonesia, ensuring your meals arrive fresh.'
    },
    {
      icon: '📊',
      title: 'Detailed Nutrition Info',
      description: 'Complete nutritional information for every meal, helping you make informed healthy choices.'
    },
    {
      icon: '🌱',
      title: 'Fresh Ingredients',
      description: 'Premium quality, fresh ingredients sourced locally to ensure the best taste and nutrition.'
    },
    {
      icon: '⏰',
      title: 'Flexible Scheduling',
      description: 'Choose your delivery schedule - daily, weekly, or custom plans that fit your lifestyle.'
    },
    {
      icon: '💚',
      title: 'Healthy Options',
      description: 'Wide variety of healthy meal options including vegetarian, vegan, and special dietary requirements.'
    }
  ];

  return (
    <section id="services" className="section services">
      <div className="container">
        <h2 className="section-title">Our Services</h2>
        <p className="section-subtitle">
          Discover what makes SEA Catering the preferred choice for healthy meals across Indonesia
        </p>
        
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-icon">
                <span>{service.icon}</span>
              </div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services; 