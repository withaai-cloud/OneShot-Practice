import React, { useState } from 'react';
import './AssignClientModal.css';

function AssignClientModal({ client, onAssign, onCancel, practiceUsers, userType }) {
  const [email, setEmail] = useState('');
  const [assignedUsers, setAssignedUsers] = useState(client.sharedWith || []);

  const handleAddUser = (e) => {
    e.preventDefault();
    if (email && !assignedUsers.includes(email)) {
      const updatedUsers = [...assignedUsers, email];
      setAssignedUsers(updatedUsers);
      setEmail('');
    }
  };

  const handleRemoveUser = (emailToRemove) => {
    setAssignedUsers(assignedUsers.filter(e => e !== emailToRemove));
  };

  const handleSave = () => {
    onAssign(client.id, assignedUsers);
  };

  return (
    <div className="assign-modal-overlay">
      <div className="assign-modal-container">
        <div className="modal-header">
          <h2>Assign Access to {client.name}</h2>
          <button className="close-btn" onClick={onCancel}>✕</button>
        </div>

        <div className="modal-content">
          <p className="modal-description">
            {userType === 'client' 
              ? 'Grant access to this company by entering email addresses below.'
              : 'Grant other users in your practice access to this client\'s files by entering their email addresses below.'}
          </p>

          {practiceUsers && practiceUsers.length > 0 && (
            <div className="practice-users-suggestions">
              <p className="suggestions-title">Users in your practice:</p>
              <div className="suggestions-list">
                {practiceUsers.map((user, index) => (
                  <button
                    key={index}
                    type="button"
                    className="suggestion-btn"
                    onClick={() => {
                      if (!assignedUsers.includes(user.email)) {
                        setAssignedUsers([...assignedUsers, user.email]);
                      }
                    }}
                    disabled={assignedUsers.includes(user.email)}
                  >
                    {user.fullName} ({user.email})
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleAddUser} className="add-user-form">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter user email address"
              className="email-input"
            />
            <button type="submit" className="add-btn">Add User</button>
          </form>

          {assignedUsers.length > 0 && (
            <div className="assigned-users-list">
              <h3>Users with Access:</h3>
              <div className="users-container">
                {assignedUsers.map((userEmail, index) => (
                  <div key={index} className="user-item">
                    <span className="user-email">{userEmail}</span>
                    <button 
                      className="remove-btn"
                      onClick={() => handleRemoveUser(userEmail)}
                      title="Remove access"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {assignedUsers.length === 0 && (
            <div className="no-users">
              <p>No users assigned yet. Add users above to grant them access.</p>
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onCancel}>Cancel</button>
          <button className="save-btn" onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

export default AssignClientModal;