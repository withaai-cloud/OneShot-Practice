import React from 'react';
import './TimeBilling.css';

function TimeBilling({ practice, onBack }) {
  return (
    <div className="time-billing">
      {/* Header */}
      <div className="module-header">
        <div className="header-content">
          <button className="back-btn" onClick={onBack}>
            ← Back to Practice
          </button>
          <div className="module-title">
            <h1>⏱️ Time & Billing</h1>
            <p className="client-name">{practice.name}</p>
          </div>
        </div>
      </div>

      {/* Placeholder Content */}
      <div className="time-billing-container">
        <div className="placeholder-content">
          <div className="placeholder-icon">⏱️</div>
          <h2>Time & Billing Module</h2>
          <p>Track time, manage billing, and generate invoices for your practice.</p>
          <div className="coming-soon-badge">Coming Soon</div>
        </div>
      </div>
    </div>
  );
}

export default TimeBilling;