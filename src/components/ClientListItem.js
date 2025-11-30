import React, { useState } from 'react';
import './ClientListItem.css';

function ClientListItem({ client, onEdit, onDelete, onAssign, onTransfer, onModuleClick, currentUser, isExpanded, onToggle, canDelete }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const toggleExpand = () => {
    onToggle(client.id);
  };

  const handleDelete = () => {
    if (deleteConfirmText.toLowerCase() === 'delete') {
      onDelete(client.id);
      setShowDeleteConfirm(false);
      setDeleteConfirmText('');
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className={`client-list-item ${isExpanded ? 'expanded' : ''}`}>
      {/* Client Header */}
      <div className="client-header" onClick={toggleExpand}>
        <div className="client-main-info">
          <h3>{client.name}</h3>
          <div className="client-meta">
            <span className="client-reg-number">{client.idOrRegNumber}</span>
            {client.companyType && (
              <>
                <span className="meta-separator">•</span>
                <span className="client-type">{client.companyType}</span>
              </>
            )}
          </div>
        </div>
        <div className="client-actions" onClick={(e) => e.stopPropagation()}>
          <button 
            className="action-btn edit-btn" 
            onClick={(e) => {
              e.stopPropagation();
              onEdit(client);
            }}
            title="Edit Client"
          >
            ✏️ Edit
          </button>
          <button 
            className="action-btn assign-btn" 
            onClick={(e) => {
              e.stopPropagation();
              onAssign(client);
            }}
            title="Assign Access"
          >
            👥 Assign
          </button>
          <button 
            className="expand-btn"
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="client-details">
          {/* Module Buttons */}
          <div className="modules-section">
            <h4>Client Modules</h4>
            <div className="modules-grid">
              {client.modules?.accounting && (
                <button 
                  className="module-btn accounting-module"
                  onClick={() => onModuleClick(client, 'accounting')}
                >
                  <span className="module-icon">📊</span>
                  <span className="module-name">Accounting</span>
                </button>
              )}
              {client.modules?.assets && (
                <button 
                  className="module-btn assets-module"
                  onClick={() => onModuleClick(client, 'assets')}
                >
                  <span className="module-icon">💼</span>
                  <span className="module-name">Asset Manager</span>
                </button>
              )}
              {client.modules?.payroll && (
                <button 
                  className="module-btn payroll-module"
                  onClick={() => onModuleClick(client, 'payroll')}
                >
                  <span className="module-icon">💰</span>
                  <span className="module-name">Payroll</span>
                </button>
              )}
              {client.modules?.tax && (
                <button 
                  className="module-btn tax-module"
                  onClick={() => onModuleClick(client, 'tax')}
                >
                  <span className="module-icon">📑</span>
                  <span className="module-name">Tax Management</span>
                </button>
              )}
              {client.modules?.shares && (
                <button 
                  className="module-btn shares-module"
                  onClick={() => onModuleClick(client, 'shares')}
                >
                  <span className="module-icon">📈</span>
                  <span className="module-name">Shares & Members</span>
                </button>
              )}
              {client.modules?.statutory && (
                <button 
                  className="module-btn statutory-module"
                  onClick={() => onModuleClick(client, 'statutory')}
                >
                  <span className="module-icon">📋</span>
                  <span className="module-name">Statutory Documents</span>
                </button>
              )}
            </div>
            {(!client.modules || Object.values(client.modules).every(v => !v)) && (
              <p className="no-modules-message">No modules enabled for this client</p>
            )}
          </div>

          {/* Company Information */}
          <div className="details-section">
            <h4>Company Information</h4>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Company Type:</span>
                <span className="detail-value">{client.companyType || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Financial Year End:</span>
                <span className="detail-value">{formatDate(client.financialYearEnd)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Registration Number:</span>
                <span className="detail-value">{client.idOrRegNumber || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Tax Information */}
          <div className="details-section">
            <h4>Tax Information</h4>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Tax Number:</span>
                <span className="detail-value">{client.taxNumber || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">VAT Number:</span>
                <span className="detail-value">{client.vatNumber || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">VAT Sequence:</span>
                <span className="detail-value">{client.vatSequence || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">PAYE Number:</span>
                <span className="detail-value">{client.payeNumber || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">UIF Number:</span>
                <span className="detail-value">{client.uifNumber || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">COIDA Number:</span>
                <span className="detail-value">{client.coidaNumber || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="details-section">
            <h4>Contact Information</h4>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Contact Person:</span>
                <span className="detail-value">{client.contactPerson || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{client.email || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Phone:</span>
                <span className="detail-value">{client.phone || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="details-section">
            <h4>Address Information</h4>
            <div className="details-grid">
              <div className="detail-item full-width">
                <span className="detail-label">Address:</span>
                <span className="detail-value">
                  {client.address && (
                    <>
                      {client.address}
                      {client.city && `, ${client.city}`}
                      {client.province && `, ${client.province}`}
                      {client.postalCode && `, ${client.postalCode}`}
                    </>
                  )}
                  {!client.address && 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Access Information */}
          {client.sharedWith && client.sharedWith.length > 0 && (
            <div className="details-section">
              <h4>Shared With</h4>
              <div className="shared-users">
                {client.sharedWith.map((email, index) => (
                  <span key={index} className="shared-user-tag">{email}</span>
                ))}
              </div>
            </div>
          )}

          {/* Delete Button */}
          {canDelete && (
            <div className="details-section danger-zone">
              {!showDeleteConfirm ? (
                <button 
                  className="delete-btn"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  🗑️ Delete Client
                </button>
              ) : (
                <div className="delete-confirm">
                  <p>Are you sure you want to delete <strong>{client.name}</strong>?</p>
                  <p className="delete-instruction">Type <strong>delete</strong> to confirm:</p>
                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder="Type 'delete' to confirm"
                    className="delete-confirm-input"
                    autoFocus
                  />
                  <div className="confirm-actions">
                    <button 
                      className="confirm-no" 
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeleteConfirmText('');
                      }}
                    >
                      Cancel
                    </button>
                    <button 
                      className="confirm-yes" 
                      onClick={handleDelete}
                      disabled={deleteConfirmText.toLowerCase() !== 'delete'}
                    >
                      Yes, Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Transfer Button (Super Users only) */}
          {currentUser.userType === 'super' && canDelete && (
            <div className="details-section transfer-zone">
              <button 
                className="transfer-btn-action"
                onClick={() => onTransfer(client)}
              >
                🔄 Transfer to Another Super User
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ClientListItem;