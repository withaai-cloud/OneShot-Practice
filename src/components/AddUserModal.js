import React, { useState } from 'react';
import './AddUserModal.css';

function AddUserModal({ onAddUser, onCancel, practiceName }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

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

    // Create accounting user
    const newUser = {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      role: 'Accounting User',
      userType: 'accounting',
      practiceName: practiceName
    };

    onAddUser(newUser);
  };

  return (
    <div className="add-user-modal-overlay">
      <div className="add-user-modal-container">
        <div className="modal-header">
          <h2>Add Accounting User</h2>
          <button className="close-btn" onClick={onCancel}>✕</button>
        </div>

        <div className="modal-content">
          <p className="modal-description">
            Add a new accounting user to <strong>{practiceName}</strong>
          </p>

          <form onSubmit={handleSubmit} className="add-user-form">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter full name"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="user@email.com"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 6 characters"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                className="form-input"
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={onCancel}>
                Cancel
              </button>
              <button type="submit" className="submit-btn">
                Add User
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddUserModal;