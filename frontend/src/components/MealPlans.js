import React, { useState } from 'react';
import './MealPlans.css';

const MealPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const mealPlans = [
    {
      id: 1,
      name: "Basic Healthy Plan",
      price: "Rp 150.000",
      pricePerDay: "Rp 50.000",
      description: "Perfect for beginners who want to start their healthy eating journey. Includes 3 balanced meals per day.",
      image: "🥗",
      duration: "3 days",
      calories: "1200-1500 kcal/day",
      features: [
        "3 meals per day",
        "Balanced nutrition",
        "Fresh ingredients",
        "Free delivery"
      ],
      details: "Our Basic Healthy Plan is designed for those who are just starting their healthy eating journey. Each meal is carefully crafted to provide balanced nutrition while being delicious and satisfying."
    },
    {
      id: 2,
      name: "Premium Wellness Plan",
      price: "Rp 350.000",
      pricePerDay: "Rp 50.000",
      description: "Advanced meal plan with premium ingredients, perfect for fitness enthusiasts and health-conscious individuals.",
      image: "🥑",
      duration: "7 days",
      calories: "1500-1800 kcal/day",
      features: [
        "3 meals + 2 snacks per day",
        "Premium ingredients",
        "Customizable options",
        "Priority delivery",
        "Nutrition consultation"
      ],
      details: "The Premium Wellness Plan is our most popular option, featuring premium ingredients and comprehensive nutrition. Perfect for those who are serious about their health and fitness goals."
    },
    {
      id: 3,
      name: "Vegetarian Delight",
      price: "Rp 280.000",
      pricePerDay: "Rp 40.000",
      description: "Plant-based meal plan with delicious vegetarian options, rich in protein and essential nutrients.",
      image: "🥬",
      duration: "7 days",
      calories: "1300-1600 kcal/day",
      features: [
        "100% plant-based",
        "High protein content",
        "Rich in fiber",
        "Eco-friendly packaging",
        "Free delivery"
      ],
      details: "Our Vegetarian Delight plan is perfect for those who prefer plant-based eating. Each meal is packed with protein, fiber, and essential nutrients from natural plant sources."
    },
    {
      id: 4,
      name: "Weight Loss Program",
      price: "Rp 400.000",
      pricePerDay: "Rp 57.000",
      description: "Specialized meal plan designed for weight loss with controlled calories and metabolism-boosting ingredients.",
      image: "⚖️",
      duration: "7 days",
      calories: "1000-1300 kcal/day",
      features: [
        "Calorie-controlled meals",
        "Metabolism boosters",
        "Weekly progress tracking",
        "Personal coach support",
        "Flexible scheduling"
      ],
      details: "The Weight Loss Program is scientifically designed to help you achieve your weight loss goals safely and effectively. Each meal is calorie-controlled and includes metabolism-boosting ingredients."
    }
  ];

  const openModal = (plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
  };

  return (
    <section id="menu" className="section meal-plans">
      <div className="container">
        <h2 className="section-title">Our Meal Plans</h2>
        <p className="section-subtitle">
          Choose from our variety of healthy meal plans designed to meet your dietary needs and lifestyle
        </p>
        
        <div className="meal-plans-grid">
          {mealPlans.map((plan) => (
            <div key={plan.id} className="meal-plan-card">
              <div className="plan-image">
                <span className="plan-emoji">{plan.image}</span>
              </div>
              
              <div className="plan-content">
                <h3 className="plan-name">{plan.name}</h3>
                <div className="plan-price">
                  <span className="price-main">{plan.price}</span>
                  <span className="price-per-day">({plan.pricePerDay}/day)</span>
                </div>
                
                <p className="plan-description">{plan.description}</p>
                
                <div className="plan-details">
                  <div className="detail-item">
                    <span className="detail-label">Duration:</span>
                    <span className="detail-value">{plan.duration}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Calories:</span>
                    <span className="detail-value">{plan.calories}</span>
                  </div>
                </div>
                
                <div className="plan-features">
                  {plan.features.slice(0, 3).map((feature, index) => (
                    <span key={index} className="feature-tag">{feature}</span>
                  ))}
                </div>
                
                <button 
                  className="btn btn-primary see-details-btn"
                  onClick={() => openModal(plan)}
                >
                  See More Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for detailed plan information */}
      {isModalOpen && selectedPlan && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            
            <div className="modal-header">
              <span className="modal-emoji">{selectedPlan.image}</span>
              <h2>{selectedPlan.name}</h2>
            </div>
            
            <div className="modal-body">
              <div className="modal-price">
                <span className="modal-price-main">{selectedPlan.price}</span>
                <span className="modal-price-per-day">({selectedPlan.pricePerDay}/day)</span>
              </div>
              
              <p className="modal-description">{selectedPlan.details}</p>
              
              <div className="modal-details">
                <div className="modal-detail-item">
                  <span className="modal-detail-label">Duration:</span>
                  <span className="modal-detail-value">{selectedPlan.duration}</span>
                </div>
                <div className="modal-detail-item">
                  <span className="modal-detail-label">Calories:</span>
                  <span className="modal-detail-value">{selectedPlan.calories}</span>
                </div>
              </div>
              
              <div className="modal-features">
                <h4>What's Included:</h4>
                <ul>
                  {selectedPlan.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>
                Close
              </button>
              <button className="btn btn-primary">
                Subscribe Now
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default MealPlans; 