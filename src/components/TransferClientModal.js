import React, { useState } from 'react';
import './TransferClientModal.css';

function TransferClientModal({ client, onTransfer, onCancel, allUsers, currentUserEmail }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter an email address');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (email === currentUserEmail) {
      setError('You cannot transfer to yourself');
      return;
    }

    // Check if user exists and is a Super User
    const targetUser = allUsers.find(u => u.email === email);
    if (!targetUser) {
      setError('User not found in the system');
      return;
    }

    if (targetUser.userType !== 'super') {
      setError('You can only transfer to Super Users');
      return;
    }

    onTransfer(client.id, email);
  };

  return (
    <div className="transfer-modal-overlay">
      <div className="transfer-modal-container">
        <div className="modal-header">
          <h2>Transfer Client Ownership</h2>
          <button className="close-btn" onClick={onCancel}>✕</button>
        </div>

        <div className="modal-content">
          <div className="client-info">
            <h3>{client.name}</h3>
            <p>Registration: {client.idOrRegNumber}</p>
          </div>

          <p className="modal-description">
            Transfer ownership of this client to another Super User. The new owner will have full control over this client, including the ability to edit, delete, and manage access.
          </p>

          <form onSubmit={handleSubmit} className="transfer-form">
            <div className="form-group">
              <label>Super User Email Address *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="Enter Super User email"
                className="form-input"
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="warning-box">
              <div className="warning-icon">⚠️</div>
              <div>
                <strong>Warning:</strong> This action cannot be undone. Once transferred, you will no longer be able to delete this client.
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={onCancel}>
                Cancel
              </button>
              <button type="submit" className="transfer-btn">
                Transfer Client
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TransferClientModal;