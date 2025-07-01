import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { subscriptionAPI } from '../services/api';
import { format } from 'date-fns';
import './UserDashboard.css';

const UserDashboard = () => {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [pauseDates, setPauseDates] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await subscriptionAPI.getUserSubscriptions();
      console.log('Fetched subscriptions response:', response);
      setSubscriptions(response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load subscriptions');
      console.error('Error fetching subscriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePauseSubscription = async () => {
    try {
      console.log('Attempting to pause subscription:', selectedSubscription.id);
      console.log('Pause dates:', pauseDates);
      const response = await subscriptionAPI.pause(selectedSubscription.id, {
        pause_start_date: pauseDates.startDate,
        pause_end_date: pauseDates.endDate
      });
      console.log('Pause response:', response);
      
      setShowPauseModal(false);
      setSelectedSubscription(null);
      setPauseDates({ startDate: '', endDate: '' });
      fetchSubscriptions();
      alert('Subscription paused successfully!');
    } catch (err) {
      console.error('Pause subscription error:', err);
      console.error('Error response:', err.response);
      alert(err.response?.data?.detail || 'Failed to pause subscription');
    }
  };

  const handleResumeSubscription = async (subscriptionId) => {
    try {
      console.log('Attempting to resume subscription:', subscriptionId);
      const response = await subscriptionAPI.resume(subscriptionId);
      console.log('Resume response:', response);
      fetchSubscriptions();
      alert('Subscription resumed successfully!');
    } catch (err) {
      console.error('Resume subscription error:', err);
      console.error('Error response:', err.response);
      alert(err.response?.data?.detail || 'Failed to resume subscription');
    }
  };

  const handleCancelSubscription = async () => {
    try {
      await subscriptionAPI.deactivate(selectedSubscription.id);
      setShowCancelModal(false);
      setSelectedSubscription(null);
      fetchSubscriptions();
      alert('Subscription cancelled successfully!');
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to cancel subscription');
    }
  };

  const openPauseModal = (subscription) => {
    setSelectedSubscription(subscription);
    setShowPauseModal(true);
  };

  const openCancelModal = (subscription) => {
    setSelectedSubscription(subscription);
    setShowCancelModal(true);
  };

  const getSubscriptionStatus = (subscription) => {
    if (!subscription.is_active) return { status: 'Cancelled', color: 'red' };
    if (subscription.pause_start_date && subscription.pause_end_date) {
      const today = new Date();
      const startDate = new Date(subscription.pause_start_date);
      const endDate = new Date(subscription.pause_end_date);
      
      if (today >= startDate && today <= endDate) {
        return { status: 'Paused', color: 'orange' };
      }
    }
    return { status: 'Active', color: 'green' };
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="user-dashboard">
        <div className="dashboard-header">
          <h1>My Dashboard</h1>
          <p>Welcome back, {user?.full_name}!</p>
        </div>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your subscriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <h1>My Dashboard</h1>
        <p>Welcome back, {user?.full_name}!</p>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchSubscriptions}>Try Again</button>
        </div>
      )}

      <div className="subscriptions-section">
        <h2>My Subscriptions</h2>
        
        {subscriptions.length === 0 ? (
          <div className="no-subscriptions">
            <div className="no-subscriptions-icon">📋</div>
            <h3>No subscriptions found</h3>
            <p>You haven't created any subscriptions yet.</p>
          </div>
        ) : (
          <div className="subscriptions-grid">
            {subscriptions.map((subscription) => {
              const status = getSubscriptionStatus(subscription);
              return (
                <div key={subscription.id} className="subscription-card">
                  <div className="subscription-header">
                    <h3>{subscription.name}</h3>
                    <span className={`status-badge ${status.color}`}>
                      {status.status}
                    </span>
                  </div>
                  
                  <div className="subscription-details">
                    <div className="detail-row">
                      <span className="label">Plan:</span>
                      <span className="value">{subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Meal Types:</span>
                      <span className="value">{subscription.meal_types.join(', ')}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Delivery Days:</span>
                      <span className="value">{subscription.delivery_days.join(', ')}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Total Price:</span>
                      <span className="value price">{formatPrice(subscription.total_price)}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Created:</span>
                      <span className="value">{format(new Date(subscription.created_at), 'MMM dd, yyyy')}</span>
                    </div>
                    {subscription.pause_start_date && subscription.pause_end_date && (
                      <div className="detail-row">
                        <span className="label">Paused Until:</span>
                        <span className="value">{format(new Date(subscription.pause_end_date), 'MMM dd, yyyy')}</span>
                      </div>
                    )}
                  </div>

                  <div className="subscription-actions">
                    {status.status === 'Active' && (
                      <>
                        <button 
                          className="btn-pause"
                          onClick={() => openPauseModal(subscription)}
                        >
                          Pause Subscription
                        </button>
                        <button 
                          className="btn-cancel"
                          onClick={() => openCancelModal(subscription)}
                        >
                          Cancel Subscription
                        </button>
                      </>
                    )}
                    {status.status === 'Paused' && (
                      <button 
                        className="btn-resume"
                        onClick={() => handleResumeSubscription(subscription.id)}
                      >
                        Resume Subscription
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pause Modal */}
      {showPauseModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Pause Subscription</h3>
              <button 
                className="modal-close"
                onClick={() => setShowPauseModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>Select the date range to pause your subscription:</p>
              <div className="form-group">
                <label>Start Date:</label>
                <input
                  type="date"
                  value={pauseDates.startDate}
                  onChange={(e) => setPauseDates({...pauseDates, startDate: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="form-group">
                <label>End Date:</label>
                <input
                  type="date"
                  value={pauseDates.endDate}
                  onChange={(e) => setPauseDates({...pauseDates, endDate: e.target.value})}
                  min={pauseDates.startDate || new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => setShowPauseModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={handlePauseSubscription}
                disabled={!pauseDates.startDate || !pauseDates.endDate}
              >
                Pause Subscription
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Cancel Subscription</h3>
              <button 
                className="modal-close"
                onClick={() => setShowCancelModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to cancel this subscription?</p>
              <p className="warning-text">
                This action cannot be undone. You will lose access to your meal plan.
              </p>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => setShowCancelModal(false)}
              >
                Keep Subscription
              </button>
              <button 
                className="btn-danger"
                onClick={handleCancelSubscription}
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard; 