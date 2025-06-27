import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { subscriptionAPI } from '../services/api';
import './UserSubscriptions.css';

const UserSubscriptions = () => {
  const { isAuthenticated } = useAuth();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  const mealTypeLabels = {
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner'
  };

  const deliveryDayLabels = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday'
  };

  const planLabels = {
    diet: 'Diet Plan',
    protein: 'Protein Plan',
    royal: 'Royal Plan'
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubscriptions();
    }
  }, [isAuthenticated]);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await subscriptionAPI.getUserSubscriptions();
      if (response.data.success) {
        setSubscriptions(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      setError('Failed to load subscriptions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (subscriptionId) => {
    if (!window.confirm('Are you sure you want to deactivate this subscription?')) {
      return;
    }

    try {
      const response = await subscriptionAPI.deactivate(subscriptionId);
      if (response.data.success) {
        // Update the subscription in the list
        setSubscriptions(prev => 
          prev.map(sub => 
            sub.id === subscriptionId 
              ? { ...sub, is_active: false }
              : sub
          )
        );
        alert('Subscription deactivated successfully');
      }
    } catch (error) {
      console.error('Error deactivating subscription:', error);
      alert('Failed to deactivate subscription. Please try again.');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="user-subscriptions">
        <div className="auth-required">
          <h2>My Subscriptions</h2>
          <p>Please log in to view your subscriptions.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="user-subscriptions">
        <div className="loading">
          <h2>My Subscriptions</h2>
          <p>Loading your subscriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-subscriptions">
      <h2>My Subscriptions</h2>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {subscriptions.length === 0 ? (
        <div className="no-subscriptions">
          <p>You don't have any subscriptions yet.</p>
          <p>Visit our subscription page to create your first meal plan subscription.</p>
        </div>
      ) : (
        <div className="subscriptions-list">
          {subscriptions.map((subscription) => (
            <div 
              key={subscription.id} 
              className={`subscription-card ${!subscription.is_active ? 'inactive' : ''}`}
            >
              <div className="subscription-header">
                <h3>{subscription.name}</h3>
                <span className={`status ${subscription.is_active ? 'active' : 'inactive'}`}>
                  {subscription.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="subscription-details">
                <div className="detail-row">
                  <span className="label">Plan:</span>
                  <span className="value">{planLabels[subscription.plan]}</span>
                </div>
                
                <div className="detail-row">
                  <span className="label">Meal Types:</span>
                  <span className="value">
                    {subscription.meal_types.map(type => mealTypeLabels[type]).join(', ')}
                  </span>
                </div>
                
                <div className="detail-row">
                  <span className="label">Delivery Days:</span>
                  <span className="value">
                    {subscription.delivery_days.map(day => deliveryDayLabels[day]).join(', ')}
                  </span>
                </div>
                
                <div className="detail-row">
                  <span className="label">Total Price:</span>
                  <span className="value price">{formatPrice(subscription.total_price)}</span>
                </div>
                
                <div className="detail-row">
                  <span className="label">Created:</span>
                  <span className="value">{formatDate(subscription.created_at)}</span>
                </div>

                {subscription.allergies && (
                  <div className="detail-row">
                    <span className="label">Allergies:</span>
                    <span className="value">{subscription.allergies}</span>
                  </div>
                )}
              </div>

              <div className="subscription-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedSubscription(subscription)}
                >
                  View Details
                </button>
                
                {subscription.is_active && (
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeactivate(subscription.id)}
                  >
                    Deactivate
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Subscription Detail Modal */}
      {selectedSubscription && (
        <div className="modal-overlay" onClick={() => setSelectedSubscription(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close"
              onClick={() => setSelectedSubscription(null)}
            >
              ×
            </button>
            
            <h3>Subscription Details</h3>
            
            <div className="modal-details">
              <div className="detail-row">
                <span className="label">Name:</span>
                <span className="value">{selectedSubscription.name}</span>
              </div>
              
              <div className="detail-row">
                <span className="label">Phone:</span>
                <span className="value">{selectedSubscription.phone}</span>
              </div>
              
              <div className="detail-row">
                <span className="label">Plan:</span>
                <span className="value">{planLabels[selectedSubscription.plan]}</span>
              </div>
              
              <div className="detail-row">
                <span className="label">Meal Types:</span>
                <span className="value">
                  {selectedSubscription.meal_types.map(type => mealTypeLabels[type]).join(', ')}
                </span>
              </div>
              
              <div className="detail-row">
                <span className="label">Delivery Days:</span>
                <span className="value">
                  {selectedSubscription.delivery_days.map(day => deliveryDayLabels[day]).join(', ')}
                </span>
              </div>
              
              <div className="detail-row">
                <span className="label">Total Price:</span>
                <span className="value price">{formatPrice(selectedSubscription.total_price)}</span>
              </div>
              
              <div className="detail-row">
                <span className="label">Status:</span>
                <span className={`value status ${selectedSubscription.is_active ? 'active' : 'inactive'}`}>
                  {selectedSubscription.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div className="detail-row">
                <span className="label">Created:</span>
                <span className="value">{formatDate(selectedSubscription.created_at)}</span>
              </div>

              {selectedSubscription.allergies && (
                <div className="detail-row">
                  <span className="label">Allergies:</span>
                  <span className="value">{selectedSubscription.allergies}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSubscriptions; 