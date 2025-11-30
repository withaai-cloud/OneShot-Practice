import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage({ onLogin, registeredUsers }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  // Demo credentials for testing
  const demoUsers = {
    super: { email: 'super@oneshot.co.za', password: 'super123', role: 'Super User' },
    accounting: { email: 'accounting@oneshot.co.za', password: 'acc123', role: 'Accounting User' },
    client: { email: 'client@oneshot.co.za', password: 'client123', role: 'Client User' }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Find user in registered users
    const foundUser = registeredUsers.find(
      user => user.email === formData.email && user.password === formData.password
    );
    
    if (foundUser) {
      // Successful login
      onLogin({
        email: foundUser.email,
        role: foundUser.role,
        userType: foundUser.userType,
        fullName: foundUser.fullName,
        practiceName: foundUser.practiceName
      });
      navigate('/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Logo */}
        <div className="login-logo">
          <img src={require('../assets/images/header.png')} alt="OneShot Practice" />
        </div>

        {/* Login Form */}
        <div className="login-form-container">
          <h2>Welcome Back</h2>
          <p className="login-subtitle">Sign in to access your dashboard</p>

          <form onSubmit={handleSubmit} className="login-form">
            {/* Email Input */}
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="form-input"
                required
              />
            </div>

            {/* Password Input */}
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="form-input"
                required
              />
            </div>

            {/* Error Message */}
            {error && <div className="error-message">{error}</div>}

            {/* Submit Button */}
            <button type="submit" className="login-button">
              Sign In
            </button>

            {/* Demo Credentials Info */}
            <div className="demo-info">
              <p className="demo-title">Demo Credentials:</p>
              <p><strong>Super User:</strong> super@oneshot.co.za / super123</p>
              <p><strong>Accounting:</strong> accounting@oneshot.co.za / acc123</p>
              <p><strong>Client:</strong> client@oneshot.co.za / client123</p>
            </div>
          </form>

          {/* Back to Home */}
          <button onClick={handleBackToHome} className="back-button">
            ← Back to Home
          </button>

          {/* Register Link */}
          <div className="register-link">
            <p>Don't have an account?</p>
            <button onClick={() => navigate('/register')} className="register-link-button">
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;