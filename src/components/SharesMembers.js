import React, { useState } from 'react';
import './SharesMembers.css';

function SharesMembers({ client, onBack }) {
  // Check if module is available for this company type
  const isAvailable = !['Trust', 'Individual', 'NPO'].includes(client.companyType);
  const isCC = client.companyType === 'Closed Corporation';
  const isCompany = ['Private Company', 'Listed Company', 'NPC'].includes(client.companyType);

  const [holdings, setHoldings] = useState([
    // Demo data for companies
    ...(isCompany ? [{
      id: 1,
      certificateNumber: '001',
      firstName: 'John',
      lastName: 'Smith',
      idNumber: '8001015800080',
      email: 'john@example.com',
      phone: '011 123 4567',
      shares: 5000,
      percentage: 50,
      dateIssued: '2020-01-15',
      isActive: true,
      history: []
    }] : []),
    // Demo data for CC
    ...(isCC ? [{
      id: 1,
      firstName: 'Jane',
      lastName: 'Doe',
      idNumber: '7505055800081',
      email: 'jane@example.com',
      phone: '011 987 6543',
      memberInterest: 75,
      dateJoined: '2019-03-10',
      isActive: true,
      history: []
    }] : [])
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedHolding, setSelectedHolding] = useState(null);
  const [formData, setFormData] = useState({
    certificateNumber: '',
    firstName: '',
    lastName: '',
    idNumber: '',
    email: '',
    phone: '',
    shares: '',
    percentage: '',
    memberInterest: ''
  });
  const [transferData, setTransferData] = useState({
    newFirstName: '',
    newLastName: '',
    newIdNumber: '',
    newEmail: '',
    newPhone: '',
    transferDate: new Date().toISOString().split('T')[0]
  });

  // Get next certificate number
  const getNextCertificateNumber = () => {
    if (holdings.length === 0) return '001';
    const maxNum = Math.max(...holdings.map(h => parseInt(h.certificateNumber) || 0));
    return String(maxNum + 1).padStart(3, '0');
  };

  // Handle Add
  const handleAdd = () => {
    if (isCompany) {
      if (!formData.certificateNumber || !formData.firstName || !formData.lastName || !formData.shares) {
        alert('Please fill in all required fields');
        return;
      }
    } else if (isCC) {
      if (!formData.firstName || !formData.lastName || !formData.memberInterest) {
        alert('Please fill in all required fields');
        return;
      }
    }

    const newHolding = {
      id: Date.now(),
      ...(isCompany && { certificateNumber: formData.certificateNumber }),
      firstName: formData.firstName,
      lastName: formData.lastName,
      idNumber: formData.idNumber,
      email: formData.email,
      phone: formData.phone,
      ...(isCompany && {
        shares: parseInt(formData.shares),
        percentage: parseFloat(formData.percentage),
        dateIssued: new Date().toISOString().split('T')[0]
      }),
      ...(isCC && {
        memberInterest: parseFloat(formData.memberInterest),
        dateJoined: new Date().toISOString().split('T')[0]
      }),
      isActive: true,
      history: []
    };

    setHoldings([...holdings, newHolding]);
    setShowAddModal(false);
    resetForm();
  };

  // Handle Transfer
  const handleTransfer = () => {
    if (!transferData.newFirstName || !transferData.newLastName) {
      alert('Please fill in all required fields');
      return;
    }

    const updatedHoldings = holdings.map(h => {
      if (h.id === selectedHolding.id) {
        const historyEntry = {
          date: transferData.transferDate,
          fromFirstName: h.firstName,
          fromLastName: h.lastName,
          fromIdNumber: h.idNumber,
          toFirstName: transferData.newFirstName,
          toLastName: transferData.newLastName,
          toIdNumber: transferData.newIdNumber,
          ...(isCompany && { shares: h.shares, percentage: h.percentage }),
          ...(isCC && { memberInterest: h.memberInterest })
        };

        return {
          ...h,
          firstName: transferData.newFirstName,
          lastName: transferData.newLastName,
          idNumber: transferData.newIdNumber,
          email: transferData.newEmail,
          phone: transferData.newPhone,
          history: [...h.history, historyEntry]
        };
      }
      return h;
    });

    setHoldings(updatedHoldings);
    setShowTransferModal(false);
    setSelectedHolding(null);
    resetTransferForm();
  };

  // Download Certificate
  const handleDownloadCertificate = (holding) => {
    // Create a simple certificate (in real app, use proper PDF generation)
    const certificateContent = `
SHARE CERTIFICATE

Company: ${client.name}
Registration: ${client.idOrRegNumber}

Certificate Number: ${holding.certificateNumber}
Date Issued: ${new Date(holding.dateIssued).toLocaleDateString('en-ZA')}

This certifies that:
${holding.firstName} ${holding.lastName}
ID Number: ${holding.idNumber}

is the registered holder of ${holding.shares} ordinary shares
representing ${holding.percentage}% of the issued share capital

_______________________
Director Signature
    `;

    const blob = new Blob([certificateContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Certificate_${holding.certificateNumber}_${holding.lastName}.txt`;
    link.click();
  };

  // Reset forms
  const resetForm = () => {
    setFormData({
      certificateNumber: getNextCertificateNumber(),
      firstName: '',
      lastName: '',
      idNumber: '',
      email: '',
      phone: '',
      shares: '',
      percentage: '',
      memberInterest: ''
    });
  };

  const resetTransferForm = () => {
    setTransferData({
      newFirstName: '',
      newLastName: '',
      newIdNumber: '',
      newEmail: '',
      newPhone: '',
      transferDate: new Date().toISOString().split('T')[0]
    });
  };

  // Open add modal
  const openAddModal = () => {
    resetForm();
    setFormData(prev => ({
      ...prev,
      certificateNumber: getNextCertificateNumber()
    }));
    setShowAddModal(true);
  };

  // If module not available
  if (!isAvailable) {
    return (
      <div className="shares-members">
        <div className="module-header">
          <div className="header-content">
            <button className="back-btn" onClick={onBack}>
              ← Back to Dashboard
            </button>
            <div className="module-title">
              <h1>📈 Shares & Members</h1>
              <p className="client-name">{client.name}</p>
            </div>
          </div>
        </div>
        <div className="not-available-container">
          <div className="not-available-message">
            <div className="not-available-icon">⚠️</div>
            <h2>Module Not Available</h2>
            <p>The Shares & Members module is not available for {client.companyType} entities.</p>
            <p className="small-text">This module is only available for Companies and Closed Corporations.</p>
          </div>
        </div>
      </div>
    );
  }

  const activeHoldings = holdings.filter(h => h.isActive);

  return (
    <div className="shares-members">
      {/* Header */}
      <div className="module-header">
        <div className="header-content">
          <button className="back-btn" onClick={onBack}>
            ← Back to Dashboard
          </button>
          <div className="module-title">
            <h1>📈 {isCC ? 'Members Interest Register' : 'Share Register'}</h1>
            <p className="client-name">{client.name}</p>
          </div>
        </div>
        <button className="add-btn" onClick={openAddModal}>
          ➕ {isCC ? 'Add Member' : 'Add Shares'}
        </button>
      </div>

      {/* Holdings List */}
      <div className="holdings-container">
        {activeHoldings.length === 0 ? (
          <div className="no-holdings">
            <div className="no-holdings-icon">📈</div>
            <h2>No {isCC ? 'Members' : 'Shareholders'} Yet</h2>
            <p>Add your first {isCC ? 'member' : 'shareholder'} using the button above.</p>
          </div>
        ) : (
          <div className="holdings-list">
            <div className="list-header">
              {isCompany && <div className="col-cert">Cert #</div>}
              <div className="col-name">Name</div>
              <div className="col-id">ID Number</div>
              <div className="col-contact">Contact</div>
              {isCompany && <div className="col-shares">Shares</div>}
              {isCompany && <div className="col-percentage">%</div>}
              {isCC && <div className="col-interest">Member Interest</div>}
              <div className="col-actions">Actions</div>
            </div>
            {activeHoldings.map(holding => (
              <div key={holding.id} className="holding-row">
                {isCompany && <div className="col-cert">{holding.certificateNumber}</div>}
                <div className="col-name">{holding.firstName} {holding.lastName}</div>
                <div className="col-id">{holding.idNumber || 'N/A'}</div>
                <div className="col-contact">
                  <div>{holding.email || 'N/A'}</div>
                  <div className="phone-small">{holding.phone || 'N/A'}</div>
                </div>
                {isCompany && <div className="col-shares">{holding.shares?.toLocaleString()}</div>}
                {isCompany && <div className="col-percentage">{holding.percentage}%</div>}
                {isCC && <div className="col-interest">{holding.memberInterest}%</div>}
                <div className="col-actions">
                  {isCompany && (
                    <button 
                      className="action-btn download-btn"
                      onClick={() => handleDownloadCertificate(holding)}
                      title="Download Certificate"
                    >
                      📄
                    </button>
                  )}
                  <button 
                    className="action-btn transfer-btn"
                    onClick={() => {
                      setSelectedHolding(holding);
                      setShowTransferModal(true);
                    }}
                    title="Transfer"
                  >
                    🔄
                  </button>
                  <button 
                    className="action-btn history-btn"
                    onClick={() => {
                      setSelectedHolding(holding);
                      setShowHistoryModal(true);
                    }}
                    title="View History"
                  >
                    📜
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>{isCC ? 'Add Member' : 'Add Shares'}</h2>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                {isCompany && (
                  <div className="form-group">
                    <label>Certificate Number *</label>
                    <input
                      type="text"
                      value={formData.certificateNumber}
                      onChange={(e) => setFormData({...formData, certificateNumber: e.target.value})}
                      placeholder="001"
                    />
                  </div>
                )}
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    placeholder="Enter first name"
                  />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    placeholder="Enter last name"
                  />
                </div>
                <div className="form-group">
                  <label>ID Number</label>
                  <input
                    type="text"
                    value={formData.idNumber}
                    onChange={(e) => setFormData({...formData, idNumber: e.target.value})}
                    placeholder="Enter ID number"
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="email@example.com"
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="011 123 4567"
                  />
                </div>
                {isCompany && (
                  <>
                    <div className="form-group">
                      <label>Number of Shares *</label>
                      <input
                        type="number"
                        value={formData.shares}
                        onChange={(e) => setFormData({...formData, shares: e.target.value})}
                        placeholder="1000"
                      />
                    </div>
                    <div className="form-group">
                      <label>Percentage Held</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.percentage}
                        onChange={(e) => setFormData({...formData, percentage: e.target.value})}
                        placeholder="10.00"
                      />
                    </div>
                  </>
                )}
                {isCC && (
                  <div className="form-group full-width">
                    <label>Member Interest (%) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.memberInterest}
                      onChange={(e) => setFormData({...formData, memberInterest: e.target.value})}
                      placeholder="25.00"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="submit-btn" onClick={handleAdd}>Add</button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {showTransferModal && selectedHolding && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Transfer {isCC ? 'Member Interest' : 'Shares'}</h2>
              <button className="close-btn" onClick={() => setShowTransferModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="transfer-from">
                <h3>From:</h3>
                <p><strong>{selectedHolding.firstName} {selectedHolding.lastName}</strong></p>
                <p>{selectedHolding.idNumber}</p>
                {isCompany && <p>{selectedHolding.shares?.toLocaleString()} shares ({selectedHolding.percentage}%)</p>}
                {isCC && <p>{selectedHolding.memberInterest}% member interest</p>}
              </div>
              <div className="transfer-arrow">→</div>
              <div className="form-grid">
                <div className="form-group">
                  <label>New First Name *</label>
                  <input
                    type="text"
                    value={transferData.newFirstName}
                    onChange={(e) => setTransferData({...transferData, newFirstName: e.target.value})}
                    placeholder="Enter first name"
                  />
                </div>
                <div className="form-group">
                  <label>New Last Name *</label>
                  <input
                    type="text"
                    value={transferData.newLastName}
                    onChange={(e) => setTransferData({...transferData, newLastName: e.target.value})}
                    placeholder="Enter last name"
                  />
                </div>
                <div className="form-group">
                  <label>New ID Number</label>
                  <input
                    type="text"
                    value={transferData.newIdNumber}
                    onChange={(e) => setTransferData({...transferData, newIdNumber: e.target.value})}
                    placeholder="Enter ID number"
                  />
                </div>
                <div className="form-group">
                  <label>New Email</label>
                  <input
                    type="email"
                    value={transferData.newEmail}
                    onChange={(e) => setTransferData({...transferData, newEmail: e.target.value})}
                    placeholder="email@example.com"
                  />
                </div>
                <div className="form-group">
                  <label>New Phone</label>
                  <input
                    type="tel"
                    value={transferData.newPhone}
                    onChange={(e) => setTransferData({...transferData, newPhone: e.target.value})}
                    placeholder="011 123 4567"
                  />
                </div>
                <div className="form-group">
                  <label>Transfer Date *</label>
                  <input
                    type="date"
                    value={transferData.transferDate}
                    onChange={(e) => setTransferData({...transferData, transferDate: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowTransferModal(false)}>Cancel</button>
              <button className="submit-btn" onClick={handleTransfer}>Transfer</button>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && selectedHolding && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Transfer History</h2>
              <button className="close-btn" onClick={() => setShowHistoryModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <h3>{selectedHolding.firstName} {selectedHolding.lastName}</h3>
              {selectedHolding.history.length === 0 ? (
                <p className="no-history">No transfer history</p>
              ) : (
                <div className="history-list">
                  {selectedHolding.history.map((entry, index) => (
                    <div key={index} className="history-item">
                      <div className="history-date">{new Date(entry.date).toLocaleDateString('en-ZA')}</div>
                      <div className="history-transfer">
                        <div><strong>From:</strong> {entry.fromFirstName} {entry.fromLastName} ({entry.fromIdNumber})</div>
                        <div><strong>To:</strong> {entry.toFirstName} {entry.toLastName} ({entry.toIdNumber})</div>
                        {isCompany && <div><strong>Amount:</strong> {entry.shares?.toLocaleString()} shares ({entry.percentage}%)</div>}
                        {isCC && <div><strong>Member Interest:</strong> {entry.memberInterest}%</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowHistoryModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SharesMembers;