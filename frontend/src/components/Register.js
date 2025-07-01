import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Register.css';

const Register = ({ onSwitchToLogin, onSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const validatePassword = (password) => {
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      isValid: hasUpper && hasLower && hasDigit && hasSpecial && password.length >= 8,
      hasUpper,
      hasLower,
      hasDigit,
      hasSpecial,
      hasLength: password.length >= 8
    };
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password strength
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      setError('Password must contain uppercase, lowercase, number, and special character, and be at least 8 characters long');
      setLoading(false);
      return;
    }

    const result = await register(formData.fullName, formData.email, formData.password);
    
    if (result.success) {
      setSuccess(result.message || 'Registration successful! Please sign in.');
      setFormData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      
      // Auto-close modal after a short delay to show success message
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        }
      }, 2000);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const passwordValidation = validatePassword(formData.password);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join SEA Catering for healthy meals</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              {success}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="form-input"
            />
            {formData.password && (
              <div className="password-strength">
                <div className={`strength-item ${passwordValidation.hasLength ? 'valid' : 'invalid'}`}>
                  ✓ At least 8 characters
                </div>
                <div className={`strength-item ${passwordValidation.hasUpper ? 'valid' : 'invalid'}`}>
                  ✓ Uppercase letter
                </div>
                <div className={`strength-item ${passwordValidation.hasLower ? 'valid' : 'invalid'}`}>
                  ✓ Lowercase letter
                </div>
                <div className={`strength-item ${passwordValidation.hasDigit ? 'valid' : 'invalid'}`}>
                  ✓ Number
                </div>
                <div className={`strength-item ${passwordValidation.hasSpecial ? 'valid' : 'invalid'}`}>
                  ✓ Special character
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
              className={`form-input ${formData.confirmPassword && formData.password !== formData.confirmPassword ? 'error' : ''}`}
            />
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <div className="error-text">Passwords do not match</div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="auth-button"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="auth-link"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register; 