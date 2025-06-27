import React, { useState } from 'react';
import './Testimonials.css';

const Testimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    message: '',
    rating: 5
  });

  // Sample testimonials data
  const [testimonials, setTestimonials] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      message: "SEA Catering has completely transformed my eating habits! The meals are delicious, healthy, and delivered right to my doorstep. I've lost 5kg in just 2 months!",
      rating: 5,
      date: "2024-06-15"
    },
    {
      id: 2,
      name: "Michael Chen",
      message: "As a busy professional, I never had time to cook healthy meals. SEA Catering's subscription plan is perfect for me. Fresh, tasty, and convenient!",
      rating: 5,
      date: "2024-06-10"
    },
    {
      id: 3,
      name: "Lisa Rodriguez",
      message: "The vegetarian options are amazing! I love how they use fresh, local ingredients. The customer service is outstanding too. Highly recommended!",
      rating: 4,
      date: "2024-06-08"
    },
    {
      id: 4,
      name: "David Kim",
      message: "I've tried many meal delivery services, but SEA Catering is by far the best. The portion sizes are perfect, and the nutritional information is very helpful.",
      rating: 5,
      date: "2024-06-05"
    },
    {
      id: 5,
      name: "Emma Wilson",
      message: "The weight loss program really works! I've been following it for 3 months and feel so much better. The meals are satisfying and I never feel hungry.",
      rating: 5,
      date: "2024-06-01"
    }
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Add new testimonial
    const newTestimonial = {
      id: testimonials.length + 1,
      name: formData.name,
      message: formData.message,
      rating: parseInt(formData.rating),
      date: new Date().toISOString().split('T')[0]
    };

    setTestimonials(prev => [newTestimonial, ...prev]);
    
    // Reset form
    setFormData({
      name: '',
      message: '',
      rating: 5
    });
    
    setShowForm(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => 
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => 
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span 
        key={index} 
        className={`star ${index < rating ? 'filled' : ''}`}
      >
        ★
      </span>
    ));
  };

  return (
    <section id="testimonials" className="section testimonials">
      <div className="container">
        <h2 className="section-title">What Our Customers Say</h2>
        <p className="section-subtitle">
          Real experiences from our satisfied customers across Indonesia
        </p>

        <div className="testimonials-content">
          {/* Testimonials Carousel */}
          <div className="testimonials-carousel">
            <div className="carousel-container">
              <div 
                className="carousel-track"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="testimonial-slide">
                    <div className="testimonial-card">
                      <div className="testimonial-rating">
                        {renderStars(testimonial.rating)}
                      </div>
                      <p className="testimonial-message">"{testimonial.message}"</p>
                      <div className="testimonial-author">
                        <h4>{testimonial.name}</h4>
                        <span className="testimonial-date">{testimonial.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel Navigation */}
            <button className="carousel-btn prev" onClick={prevSlide}>
              ‹
            </button>
            <button className="carousel-btn next" onClick={nextSlide}>
              ›
            </button>

            {/* Carousel Dots */}
            <div className="carousel-dots">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
          </div>

          {/* Add Testimonial Form */}
          <div className="testimonial-form-section">
            <h3>Share Your Experience</h3>
            <p>Help others discover the benefits of healthy eating with SEA Catering</p>
            
            {!showForm ? (
              <button 
                className="btn btn-primary"
                onClick={() => setShowForm(true)}
              >
                Write a Review
              </button>
            ) : (
              <form className="testimonial-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Your Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="rating">Rating *</label>
                  <div className="rating-input">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`rating-star ${star <= formData.rating ? 'selected' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                      >
                        ★
                      </button>
                    ))}
                    <span className="rating-text">{formData.rating} out of 5</span>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Your Review *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    placeholder="Share your experience with SEA Catering..."
                  />
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Submit Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 