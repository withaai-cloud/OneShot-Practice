import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';

function RegisterPage({ onRegister, existingPractices }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'accounting', // Default user type
    practiceName: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    // Practice validation for accounting users
    if (formData.userType === 'accounting') {
      if (!formData.practiceName) {
        setError('Practice name is required for Accounting Users');
        return;
      }
      if (!existingPractices.includes(formData.practiceName)) {
        setError('Practice does not exist. Please contact your practice Super User or enter the correct practice name.');
        return;
      }
    }

    // Get user role based on type
    let role = '';
    if (formData.userType === 'super') role = 'Super User';
    else if (formData.userType === 'accounting') role = 'Accounting User';
    else if (formData.userType === 'client') role = 'Client User';

    // Register user (in real app, this would go to a backend)
    const userData = {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password, // Include password for login
      role: role,
      userType: formData.userType,
      practiceName: formData.practiceName
    };

    // Call the parent's register function
    onRegister(userData);

    setSuccess(true);
    
    // Redirect to login after 2 seconds
    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="register-page">
      <div className="register-container">
        {/* Logo */}
        <div className="register-logo">
          <img src={require('../assets/images/header.png')} alt="OneShot Practice" />
        </div>

        {/* Registration Form */}
        <div className="register-form-container">
          {!success ? (
            <>
              <h2>Create Your Account</h2>
              <p className="register-subtitle">Join OneShot Practice today</p>

              <form onSubmit={handleSubmit} className="register-form">
                {/* Full Name */}
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="form-input"
                    required
                  />
                </div>

                {/* Email Input */}
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@company.co.za"
                    className="form-input"
                    required
                  />
                </div>

                {/* Practice Name */}
                {formData.userType === 'super' && (
                  <div className="form-group">
                    <label>Practice Name *</label>
                    <input
                      type="text"
                      name="practiceName"
                      value={formData.practiceName}
                      onChange={handleChange}
                      placeholder="Enter your practice name"
                      className="form-input"
                      required
                    />
                    <small className="help-text">
                      This will create a new practice
                    </small>
                  </div>
                )}

                {formData.userType === 'accounting' && (
                  <div className="form-group">
                    <label>Practice Name *</label>
                    <input
                      type="text"
                      name="practiceName"
                      value={formData.practiceName}
                      onChange={handleChange}
                      placeholder="Enter existing practice name"
                      className="form-input"
                      required
                      list="practice-suggestions"
                    />
                    <datalist id="practice-suggestions">
                      {existingPractices.map((practice, index) => (
                        <option key={index} value={practice} />
                      ))}
                    </datalist>
                    <small className="help-text">
                      Must match an existing practice name
                    </small>
                  </div>
                )}

                {/* User Type Selection */}
                <div className="form-group">
                  <label>Account Type *</label>
                  <select 
                    name="userType" 
                    value={formData.userType} 
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="super">Super User (Practice Owner)</option>
                    <option value="accounting">Accounting User (Staff Member)</option>
                    <option value="client">Client User</option>
                  </select>
                  <small className="help-text">
                    {formData.userType === 'super' && 'Full access to all features and settings'}
                    {formData.userType === 'accounting' && 'Access to assigned clients and modules'}
                    {formData.userType === 'client' && 'Access to your company information only'}
                  </small>
                </div>

                {/* Password Input */}
                <div className="form-group">
                  <label>Password *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password (min 6 characters)"
                    className="form-input"
                    required
                  />
                </div>

                {/* Confirm Password */}
                <div className="form-group">
                  <label>Confirm Password *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    className="form-input"
                    required
                  />
                </div>

                {/* Error Message */}
                {error && <div className="error-message">{error}</div>}

                {/* Submit Button */}
                <button type="submit" className="register-button">
                  Create Account
                </button>
              </form>
            </>
          ) : (
            <div className="success-message">
              <div className="success-icon">✓</div>
              <h2>Account Created Successfully!</h2>
              <p>Redirecting you to login...</p>
            </div>
          )}

          {/* Back to Login */}
          {!success && (
            <div className="login-link">
              <p>Already have an account?</p>
              <button onClick={handleBackToLogin} className="back-button">
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;