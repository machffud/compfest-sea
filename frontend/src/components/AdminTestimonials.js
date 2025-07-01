import React, { useState, useEffect } from 'react';
import { testimonialAPI } from '../services/api';
import { format } from 'date-fns';
import './AdminTestimonials.css';

const AdminTestimonials = ({ onClose }) => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await testimonialAPI.getAllTestimonials();
      console.log('Fetched testimonials:', response);
      setTestimonials(response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load testimonials');
      console.error('Error fetching testimonials:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (testimonialId) => {
    try {
      await testimonialAPI.approve(testimonialId);
      fetchTestimonials();
      alert('Testimonial approved successfully!');
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to approve testimonial');
    }
  };

  const handleReject = async (testimonialId) => {
    try {
      await testimonialAPI.reject(testimonialId);
      fetchTestimonials();
      alert('Testimonial rejected successfully!');
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to reject testimonial');
    }
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

  const getStatusBadge = (isApproved) => {
    if (isApproved === null || isApproved === undefined) {
      return <span className="status-badge pending">Pending</span>;
    }
    return isApproved ? 
      <span className="status-badge approved">Approved</span> : 
      <span className="status-badge rejected">Rejected</span>;
  };

  const filteredTestimonials = testimonials.filter(testimonial => {
    if (filter === 'all') return true;
    if (filter === 'pending') return testimonial.is_approved === null || testimonial.is_approved === undefined;
    if (filter === 'approved') return testimonial.is_approved === true;
    if (filter === 'rejected') return testimonial.is_approved === false;
    return true;
  });

  if (loading) {
    return (
      <div className="admin-testimonials">
        <div className="testimonials-header">
          <h2>Review Testimonials</h2>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading testimonials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-testimonials">
      <div className="testimonials-header">
        <h2>Review Testimonials</h2>
        <button className="btn-close" onClick={onClose}>×</button>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchTestimonials}>Try Again</button>
        </div>
      )}

      <div className="testimonials-controls">
        <div className="filter-controls">
          <label>Filter by status:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Testimonials</option>
            <option value="pending">Pending Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="stats">
          <span className="stat-item">
            Total: {testimonials.length}
          </span>
          <span className="stat-item">
            Pending: {testimonials.filter(t => t.is_approved === null || t.is_approved === undefined).length}
          </span>
          <span className="stat-item">
            Approved: {testimonials.filter(t => t.is_approved === true).length}
          </span>
          <span className="stat-item">
            Rejected: {testimonials.filter(t => t.is_approved === false).length}
          </span>
        </div>
      </div>

      <div className="testimonials-list">
        {filteredTestimonials.length === 0 ? (
          <div className="no-testimonials">
            <div className="no-testimonials-icon">⭐</div>
            <h3>No testimonials found</h3>
            <p>There are no testimonials matching the current filter.</p>
          </div>
        ) : (
          filteredTestimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-info">
                  <h3>{testimonial.name}</h3>
                  <div className="testimonial-meta">
                    <span className="testimonial-date">
                      {format(new Date(testimonial.created_at), 'MMM dd, yyyy')}
                    </span>
                    <div className="testimonial-rating">
                      {renderStars(testimonial.rating)}
                    </div>
                  </div>
                </div>
                <div className="testimonial-status">
                  {getStatusBadge(testimonial.is_approved)}
                </div>
              </div>
              
              <div className="testimonial-content">
                <p className="testimonial-message">"{testimonial.message}"</p>
              </div>

              <div className="testimonial-actions">
                {(testimonial.is_approved === null || testimonial.is_approved === undefined) && (
                  <>
                    <button 
                      className="btn-approve"
                      onClick={() => handleApprove(testimonial.id)}
                    >
                      Approve
                    </button>
                    <button 
                      className="btn-reject"
                      onClick={() => handleReject(testimonial.id)}
                    >
                      Reject
                    </button>
                  </>
                )}
                {testimonial.is_approved === true && (
                  <button 
                    className="btn-reject"
                    onClick={() => handleReject(testimonial.id)}
                  >
                    Reject
                  </button>
                )}
                {testimonial.is_approved === false && (
                  <button 
                    className="btn-approve"
                    onClick={() => handleApprove(testimonial.id)}
                  >
                    Approve
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminTestimonials; 