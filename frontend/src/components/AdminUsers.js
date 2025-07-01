import React, { useState, useEffect } from 'react';
import { authAPI, subscriptionAPI } from '../services/api';
import { format } from 'date-fns';
import './AdminUsers.css';

const AdminUsers = ({ onClose }) => {
  const [users, setUsers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch users and subscriptions in parallel
      const [usersResponse, subscriptionsResponse] = await Promise.all([
        authAPI.getUsers(),
        subscriptionAPI.getAllSubscriptions()
      ]);
      
      console.log('Fetched users:', usersResponse);
      console.log('Fetched subscriptions:', subscriptionsResponse);
      
      setUsers(usersResponse.data.data || []);
      setSubscriptions(subscriptionsResponse.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleActivateUser = async (userId) => {
    try {
      await authAPI.activateUser(userId);
      fetchData();
      alert('User activated successfully!');
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to activate user');
    }
  };

  const handleDeactivateUser = async (userId) => {
    try {
      await authAPI.deactivateUser(userId);
      fetchData();
      alert('User deactivated successfully!');
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to deactivate user');
    }
  };

  const handleMakeAdmin = async (userId) => {
    try {
      await authAPI.makeUserAdmin(userId);
      fetchData();
      alert('User is now admin!');
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to make user admin');
    }
  };

  const getUserSubscriptions = (userId) => {
    return subscriptions.filter(sub => sub.user_id === userId);
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

  const openUserDetails = (user) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  if (loading) {
    return (
      <div className="admin-users">
        <div className="users-header">
          <h2>View All Users</h2>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-users">
      <div className="users-header">
        <h2>View All Users</h2>
        <button className="btn-close" onClick={onClose}>×</button>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchData}>Try Again</button>
        </div>
      )}

      <div className="users-stats">
        <div className="stat-item">
          <span className="stat-number">{users.length}</span>
          <span className="stat-label">Total Users</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{users.filter(u => u.is_active).length}</span>
          <span className="stat-label">Active Users</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{users.filter(u => u.is_admin).length}</span>
          <span className="stat-label">Admins</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{subscriptions.length}</span>
          <span className="stat-label">Total Subscriptions</span>
        </div>
      </div>

      <div className="users-list">
        {users.length === 0 ? (
          <div className="no-users">
            <div className="no-users-icon">👥</div>
            <h3>No users found</h3>
            <p>There are no users registered in the system.</p>
          </div>
        ) : (
          users.map((user) => {
            const userSubscriptions = getUserSubscriptions(user.id);
            return (
              <div key={user.id} className="user-card">
                <div className="user-header">
                  <div className="user-info">
                    <h3>{user.full_name}</h3>
                    <div className="user-meta">
                      <span className="user-email">{user.email}</span>
                      <span className="user-date">
                        Joined: {format(new Date(user.created_at), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </div>
                  <div className="user-status">
                    <span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                    {user.is_admin && (
                      <span className="status-badge admin">Admin</span>
                    )}
                  </div>
                </div>
                
                <div className="user-subscriptions">
                  <h4>Subscriptions ({userSubscriptions.length})</h4>
                  {userSubscriptions.length === 0 ? (
                    <p className="no-subscriptions">No subscriptions</p>
                  ) : (
                    <div className="subscriptions-grid">
                      {userSubscriptions.map((subscription) => {
                        const status = getSubscriptionStatus(subscription);
                        return (
                          <div key={subscription.id} className="subscription-item">
                            <div className="subscription-header">
                              <span className="subscription-name">{subscription.name}</span>
                              <span className={`status-badge ${status.color}`}>
                                {status.status}
                              </span>
                            </div>
                            <div className="subscription-details">
                              <span className="plan">{subscription.plan}</span>
                              <span className="price">{formatPrice(subscription.total_price)}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="user-actions">
                  <button 
                    className="btn-view-details"
                    onClick={() => openUserDetails(user)}
                  >
                    View Details
                  </button>
                  
                  {user.is_active ? (
                    <button 
                      className="btn-deactivate"
                      onClick={() => handleDeactivateUser(user.id)}
                    >
                      Deactivate
                    </button>
                  ) : (
                    <button 
                      className="btn-activate"
                      onClick={() => handleActivateUser(user.id)}
                    >
                      Activate
                    </button>
                  )}
                  
                  {!user.is_admin && (
                    <button 
                      className="btn-make-admin"
                      onClick={() => handleMakeAdmin(user.id)}
                    >
                      Make Admin
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowUserDetails(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>User Details</h3>
              <button 
                className="modal-close"
                onClick={() => setShowUserDetails(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="user-detail-section">
                <h4>User Information</h4>
                <div className="detail-row">
                  <span className="label">Name:</span>
                  <span className="value">{selectedUser.full_name}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Email:</span>
                  <span className="value">{selectedUser.email}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Status:</span>
                  <span className={`value status-badge ${selectedUser.is_active ? 'active' : 'inactive'}`}>
                    {selectedUser.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">Role:</span>
                  <span className={`value status-badge ${selectedUser.is_admin ? 'admin' : 'user'}`}>
                    {selectedUser.is_admin ? 'Admin' : 'User'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">Joined:</span>
                  <span className="value">{format(new Date(selectedUser.created_at), 'MMM dd, yyyy HH:mm')}</span>
                </div>
              </div>

              <div className="user-detail-section">
                <h4>Subscription Details</h4>
                {getUserSubscriptions(selectedUser.id).length === 0 ? (
                  <p className="no-subscriptions">No subscriptions found</p>
                ) : (
                  getUserSubscriptions(selectedUser.id).map((subscription) => {
                    const status = getSubscriptionStatus(subscription);
                    return (
                      <div key={subscription.id} className="subscription-detail-card">
                        <div className="subscription-detail-header">
                          <h5>{subscription.name}</h5>
                          <span className={`status-badge ${status.color}`}>
                            {status.status}
                          </span>
                        </div>
                        <div className="subscription-detail-info">
                          <div className="detail-row">
                            <span className="label">Plan:</span>
                            <span className="value">{subscription.plan}</span>
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
                              <span className="label">Pause Period:</span>
                              <span className="value">
                                {format(new Date(subscription.pause_start_date), 'MMM dd, yyyy')} - {format(new Date(subscription.pause_end_date), 'MMM dd, yyyy')}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers; 