import React, { useState, useEffect } from 'react';
import Login from './Login';
import Register from './Register';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);

  if (!isOpen) return null;

  const handleSwitchToRegister = () => {
    setIsLogin(false);
  };

  const handleSwitchToLogin = () => {
    setIsLogin(true);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Auto-close on successful login/register
  const handleAuthSuccess = () => {
    onClose();
  };

  return (
    <div className="auth-modal-overlay" onClick={handleBackdropClick}>
      <div className="auth-modal">
        <button className="auth-modal-close" onClick={onClose}>
          ×
        </button>
        {isLogin ? (
          <Login onSwitchToRegister={handleSwitchToRegister} onSuccess={handleAuthSuccess} />
        ) : (
          <Register onSwitchToLogin={handleSwitchToLogin} onSuccess={handleAuthSuccess} />
        )}
      </div>
    </div>
  );
};

export default AuthModal; 