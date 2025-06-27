import React, { useState, useEffect } from 'react';
import './Subscription.css';

const Subscription = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    plan: '',
    mealTypes: [],
    deliveryDays: [],
    allergies: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  const plans = [
    { value: 'diet', label: 'Diet Plan', price: 30000 },
    { value: 'protein', label: 'Protein Plan', price: 40000 },
    { value: 'royal', label: 'Royal Plan', price: 60000 }
  ];

  const mealTypeOptions = [
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'dinner', label: 'Dinner' }
  ];

  const deliveryDayOptions = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' }
  ];

  // Calculate total price based on formula
  useEffect(() => {
    if (formData.plan && formData.mealTypes.length > 0 && formData.deliveryDays.length > 0) {
      const selectedPlan = plans.find(p => p.value === formData.plan);
      const planPrice = selectedPlan.price;
      const mealTypesCount = formData.mealTypes.length;
      const deliveryDaysCount = formData.deliveryDays.length;
      
      const total = planPrice * mealTypesCount * deliveryDaysCount * 4.3;
      setTotalPrice(total);
    } else {
      setTotalPrice(0);
    }
  }, [formData.plan, formData.mealTypes, formData.deliveryDays]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMealTypeChange = (mealType) => {
    setFormData(prev => ({
      ...prev,
      mealTypes: prev.mealTypes.includes(mealType)
        ? prev.mealTypes.filter(type => type !== mealType)
        : [...prev.mealTypes, mealType]
    }));
  };

  const handleDeliveryDayChange = (day) => {
    setFormData(prev => ({
      ...prev,
      deliveryDays: prev.deliveryDays.includes(day)
        ? prev.deliveryDays.filter(d => d !== day)
        : [...prev.deliveryDays, day]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.phone || !formData.plan || 
        formData.mealTypes.length === 0 || formData.deliveryDays.length === 0) {
      alert('Please fill in all required fields (*)');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setSubmitSuccess(false);
        setFormData({
          name: '',
          phone: '',
          plan: '',
          mealTypes: [],
          deliveryDays: [],
          allergies: ''
        });
        setTotalPrice(0);
      }, 5000);
    }, 2000);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(price);
  };

  const getSelectedPlan = () => {
    return plans.find(p => p.value === formData.plan);
  };

  if (submitSuccess) {
    return (
      <section id="subscription" className="section subscription">
        <div className="container">
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h2>Subscription Successful!</h2>
            <p>Thank you for subscribing to SEA Catering. Your subscription details have been saved.</p>
            <div className="subscription-summary">
              <h3>Subscription Summary:</h3>
              <p><strong>Plan:</strong> {getSelectedPlan()?.label}</p>
              <p><strong>Meal Types:</strong> {formData.mealTypes.map(type => 
                mealTypeOptions.find(opt => opt.value === type)?.label).join(', ')}</p>
              <p><strong>Delivery Days:</strong> {formData.deliveryDays.map(day => 
                deliveryDayOptions.find(opt => opt.value === day)?.label).join(', ')}</p>
              <p><strong>Total Price:</strong> {formatPrice(totalPrice)}</p>
            </div>
            <p>We'll contact you within 24 hours to confirm your subscription and discuss delivery details.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="subscription" className="section subscription">
      <div className="container">
        <h2 className="section-title">Subscribe to Our Meal Plans</h2>
        <p className="section-subtitle">
          Customize your healthy meal subscription with our flexible options
        </p>

        <div className="subscription-content">
          <div className="subscription-info">
            <h3>Available Plans</h3>
            <div className="plans-overview">
              {plans.map((plan) => (
                <div key={plan.value} className="plan-overview-card">
                  <h4>{plan.label}</h4>
                  <p className="plan-price">{formatPrice(plan.price)} per meal</p>
                  <ul className="plan-features">
                    {plan.value === 'diet' && (
                      <>
                        <li>Balanced nutrition</li>
                        <li>Calorie-controlled</li>
                        <li>Weight management</li>
                      </>
                    )}
                    {plan.value === 'protein' && (
                      <>
                        <li>High protein content</li>
                        <li>Muscle building</li>
                        <li>Fitness focused</li>
                      </>
                    )}
                    {plan.value === 'royal' && (
                      <>
                        <li>Premium ingredients</li>
                        <li>Gourmet preparation</li>
                        <li>Luxury dining experience</li>
                      </>
                    )}
                  </ul>
                </div>
              ))}
            </div>

            {totalPrice > 0 && (
              <div className="price-calculation">
                <h4>Price Calculation</h4>
                <div className="calculation-breakdown">
                  <p><strong>Plan:</strong> {getSelectedPlan()?.label} ({formatPrice(getSelectedPlan()?.price)} per meal)</p>
                  <p><strong>Meal Types:</strong> {formData.mealTypes.length} selected</p>
                  <p><strong>Delivery Days:</strong> {formData.deliveryDays.length} days</p>
                  <p><strong>Formula:</strong> {formatPrice(getSelectedPlan()?.price)} × {formData.mealTypes.length} × {formData.deliveryDays.length} × 4.3</p>
                  <div className="total-price">
                    <strong>Total Price: {formatPrice(totalPrice)}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="subscription-form-container">
            <form className="subscription-form" onSubmit={handleSubmit}>
              <h3>Create Your Subscription</h3>
              
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Active Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="form-group">
                <label>Plan Selection *</label>
                <div className="plan-selection">
                  {plans.map((plan) => (
                    <label key={plan.value} className="plan-option">
                      <input
                        type="radio"
                        name="plan"
                        value={plan.value}
                        checked={formData.plan === plan.value}
                        onChange={handleInputChange}
                        required
                      />
                      <div className="plan-option-content">
                        <h4>{plan.label}</h4>
                        <p>{formatPrice(plan.price)} per meal</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Meal Types * (Select at least one)</label>
                <div className="meal-types-selection">
                  {mealTypeOptions.map((mealType) => (
                    <label key={mealType.value} className="meal-type-option">
                      <input
                        type="checkbox"
                        checked={formData.mealTypes.includes(mealType.value)}
                        onChange={() => handleMealTypeChange(mealType.value)}
                      />
                      <span>{mealType.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Delivery Days * (Select delivery days)</label>
                <div className="delivery-days-selection">
                  {deliveryDayOptions.map((day) => (
                    <label key={day.value} className="delivery-day-option">
                      <input
                        type="checkbox"
                        checked={formData.deliveryDays.includes(day.value)}
                        onChange={() => handleDeliveryDayChange(day.value)}
                      />
                      <span>{day.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="allergies">Allergies & Dietary Restrictions</label>
                <textarea
                  id="allergies"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="List any allergies, dietary restrictions, or special requirements..."
                />
              </div>

              <button 
                type="submit" 
                className={`btn btn-primary submit-btn ${isSubmitting ? 'loading' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : `Subscribe Now - ${formatPrice(totalPrice)}`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Subscription; 