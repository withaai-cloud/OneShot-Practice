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
      shareType: 'Ordinary',
      percentage: 50,
      dateIssued: '2020-01-15',
      isActive: true,
      certificateHistory: [{
        certificateNumber: '001',
        shares: 5000,
        shareType: 'Ordinary',
        percentage: 50,
        dateIssued: '2020-01-15',
        status: 'active'
      }],
      transferHistory: []
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
      certificateHistory: [],
      transferHistory: []
    }] : [])
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showCertificateHistoryModal, setShowCertificateHistoryModal] = useState(false);
  const [selectedHolding, setSelectedHolding] = useState(null);
  
  const [formData, setFormData] = useState({
    certificateNumber: '',
    firstName: '',
    lastName: '',
    idNumber: '',
    email: '',
    phone: '',
    shares: '',
    shareType: 'Ordinary',
    percentage: '',
    memberInterest: ''
  });

  const [transferData, setTransferData] = useState({
    transferType: 'full', // 'full' or 'partial'
    transferAmount: '', // for partial transfers
    transferPercentage: '', // calculated for display
    shareType: 'Ordinary',
    newFirstName: '',
    newLastName: '',
    newIdNumber: '',
    newEmail: '',
    newPhone: '',
    transferDate: new Date().toISOString().split('T')[0]
  });

  // Share type options
  const shareTypes = ['Ordinary', 'Preference', 'Class A', 'Class B', 'Redeemable'];

  // Get next certificate number
  const getNextCertificateNumber = () => {
    if (holdings.length === 0) return '001';
    let maxNum = 0;
    holdings.forEach(h => {
      if (h.certificateHistory) {
        h.certificateHistory.forEach(cert => {
          const num = parseInt(cert.certificateNumber) || 0;
          if (num > maxNum) maxNum = num;
        });
      }
    });
    return String(maxNum + 1).padStart(3, '0');
  };

  // Calculate total shares
  const getTotalShares = () => {
    return holdings.reduce((sum, h) => sum + (h.shares || 0), 0);
  };

  // Handle Add
  const handleAdd = () => {
    if (isCompany) {
      if (!formData.certificateNumber || !formData.firstName || !formData.lastName || !formData.shares || !formData.shareType) {
        alert('Please fill in all required fields');
        return;
      }
    } else if (isCC) {
      if (!formData.firstName || !formData.lastName || !formData.memberInterest) {
        alert('Please fill in all required fields');
        return;
      }
    }

    const dateIssued = new Date().toISOString().split('T')[0];
    const newHolding = {
      id: Date.now(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      idNumber: formData.idNumber,
      email: formData.email,
      phone: formData.phone,
      ...(isCompany && {
        certificateNumber: formData.certificateNumber,
        shares: parseInt(formData.shares),
        shareType: formData.shareType,
        percentage: parseFloat(formData.percentage),
        dateIssued: dateIssued,
        certificateHistory: [{
          certificateNumber: formData.certificateNumber,
          shares: parseInt(formData.shares),
          shareType: formData.shareType,
          percentage: parseFloat(formData.percentage),
          dateIssued: dateIssued,
          status: 'active'
        }]
      }),
      ...(isCC && {
        memberInterest: parseFloat(formData.memberInterest),
        dateJoined: dateIssued,
        certificateHistory: []
      }),
      isActive: true,
      transferHistory: []
    };

    setHoldings([...holdings, newHolding]);
    setShowAddModal(false);
    resetForm();
  };

  // Handle Transfer
  const handleTransfer = () => {
    if (!transferData.newFirstName || !transferData.newLastName) {
      alert('Please fill in recipient details');
      return;
    }

    if (transferData.transferType === 'partial') {
      if (isCompany && !transferData.transferAmount) {
        alert('Please specify the number of shares to transfer');
        return;
      }
      if (isCC && !transferData.transferAmount) {
        alert('Please specify the member interest percentage to transfer');
        return;
      }
    }

    const transferAmount = transferData.transferType === 'full' 
      ? (isCompany ? selectedHolding.shares : selectedHolding.memberInterest)
      : parseFloat(transferData.transferAmount);

    // Validate partial transfer amount
    if (transferData.transferType === 'partial') {
      const currentAmount = isCompany ? selectedHolding.shares : selectedHolding.memberInterest;
      if (transferAmount <= 0 || transferAmount >= currentAmount) {
        alert(`Transfer amount must be between 0 and ${currentAmount}`);
        return;
      }
    }

    const newCertificateNumber = getNextCertificateNumber();
    const transferDate = transferData.transferDate;

    if (transferData.transferType === 'full') {
      // Full transfer: Archive old certificate, create new certificate for recipient
      const updatedHoldings = holdings.map(h => {
        if (h.id === selectedHolding.id) {
          // Archive the current certificate
          const archivedCerts = h.certificateHistory.map(cert => 
            cert.status === 'active' ? { ...cert, status: 'archived', archivedDate: transferDate } : cert
          );

          // Create transfer history entry
          const historyEntry = {
            date: transferDate,
            type: 'full',
            fromFirstName: h.firstName,
            fromLastName: h.lastName,
            fromIdNumber: h.idNumber,
            toFirstName: transferData.newFirstName,
            toLastName: transferData.newLastName,
            toIdNumber: transferData.newIdNumber,
            ...(isCompany && { 
              shares: h.shares,
              shareType: h.shareType,
              percentage: h.percentage,
              oldCertificate: h.certificateNumber,
              newCertificate: newCertificateNumber
            }),
            ...(isCC && { memberInterest: h.memberInterest })
          };

          // Create new certificate for new owner
          const newCertificate = {
            certificateNumber: newCertificateNumber,
            ...(isCompany && {
              shares: h.shares,
              shareType: h.shareType,
              percentage: h.percentage
            }),
            dateIssued: transferDate,
            status: 'active'
          };

          return {
            ...h,
            firstName: transferData.newFirstName,
            lastName: transferData.newLastName,
            idNumber: transferData.newIdNumber,
            email: transferData.newEmail,
            phone: transferData.newPhone,
            ...(isCompany && { certificateNumber: newCertificateNumber }),
            certificateHistory: [...archivedCerts, newCertificate],
            transferHistory: [...h.transferHistory, historyEntry]
          };
        }
        return h;
      });

      setHoldings(updatedHoldings);
    } else {
      // Partial transfer: Update sender's certificate, create new holding for recipient
      const remainingAmount = (isCompany ? selectedHolding.shares : selectedHolding.memberInterest) - transferAmount;
      const totalShares = getTotalShares();
      const newPercentage = isCompany ? ((transferAmount / totalShares) * 100).toFixed(2) : transferAmount;
      const senderNewPercentage = isCompany ? ((remainingAmount / totalShares) * 100).toFixed(2) : remainingAmount;
      
      const senderNewCertNumber = getNextCertificateNumber();
      const recipientCertNumber = String(parseInt(senderNewCertNumber) + 1).padStart(3, '0');

      // Archive sender's old certificate and create new one with reduced amount
      const updatedHoldings = holdings.map(h => {
        if (h.id === selectedHolding.id) {
          const archivedCerts = h.certificateHistory.map(cert => 
            cert.status === 'active' ? { ...cert, status: 'archived', archivedDate: transferDate } : cert
          );

          const historyEntry = {
            date: transferDate,
            type: 'partial',
            fromFirstName: h.firstName,
            fromLastName: h.lastName,
            fromIdNumber: h.idNumber,
            toFirstName: transferData.newFirstName,
            toLastName: transferData.newLastName,
            toIdNumber: transferData.newIdNumber,
            ...(isCompany && { 
              shares: transferAmount,
              shareType: transferData.shareType || h.shareType,
              percentage: parseFloat(newPercentage),
              oldCertificate: h.certificateNumber,
              newCertificate: senderNewCertNumber,
              recipientCertificate: recipientCertNumber
            }),
            ...(isCC && { memberInterest: transferAmount })
          };

          const senderNewCertificate = {
            certificateNumber: senderNewCertNumber,
            ...(isCompany && {
              shares: remainingAmount,
              shareType: h.shareType,
              percentage: parseFloat(senderNewPercentage)
            }),
            dateIssued: transferDate,
            status: 'active'
          };

          return {
            ...h,
            ...(isCompany && { 
              certificateNumber: senderNewCertNumber,
              shares: remainingAmount,
              percentage: parseFloat(senderNewPercentage)
            }),
            ...(isCC && { memberInterest: remainingAmount }),
            certificateHistory: [...archivedCerts, senderNewCertificate],
            transferHistory: [...h.transferHistory, historyEntry]
          };
        }
        return h;
      });

      // Create new holding for recipient
      const newHolding = {
        id: Date.now(),
        firstName: transferData.newFirstName,
        lastName: transferData.newLastName,
        idNumber: transferData.newIdNumber,
        email: transferData.newEmail,
        phone: transferData.newPhone,
        ...(isCompany && {
          certificateNumber: recipientCertNumber,
          shares: transferAmount,
          shareType: transferData.shareType || selectedHolding.shareType,
          percentage: parseFloat(newPercentage),
          dateIssued: transferDate,
          certificateHistory: [{
            certificateNumber: recipientCertNumber,
            shares: transferAmount,
            shareType: transferData.shareType || selectedHolding.shareType,
            percentage: parseFloat(newPercentage),
            dateIssued: transferDate,
            status: 'active'
          }]
        }),
        ...(isCC && {
          memberInterest: transferAmount,
          dateJoined: transferDate,
          certificateHistory: []
        }),
        isActive: true,
        transferHistory: [{
          date: transferDate,
          type: 'received',
          fromFirstName: selectedHolding.firstName,
          fromLastName: selectedHolding.lastName,
          fromIdNumber: selectedHolding.idNumber,
          ...(isCompany && { 
            shares: transferAmount,
            shareType: transferData.shareType || selectedHolding.shareType,
            percentage: parseFloat(newPercentage)
          }),
          ...(isCC && { memberInterest: transferAmount })
        }]
      };

      setHoldings([...updatedHoldings, newHolding]);
    }

    setShowTransferModal(false);
    setSelectedHolding(null);
    resetTransferForm();
  };

  // Download Certificate
  const handleDownloadCertificate = (holding) => {
    const activeCert = holding.certificateHistory?.find(c => c.status === 'active') || holding;
    
    const certificateContent = isCompany ? `
SHARE CERTIFICATE

Company: ${client.name}
Registration: ${client.idOrRegNumber}

Certificate Number: ${activeCert.certificateNumber}
Date Issued: ${new Date(activeCert.dateIssued).toLocaleDateString('en-ZA')}

This certifies that:
${holding.firstName} ${holding.lastName}
ID Number: ${holding.idNumber}

is the registered holder of ${activeCert.shares?.toLocaleString()} ${activeCert.shareType} shares
representing ${activeCert.percentage}% of the issued share capital

_______________________
Director Signature
    ` : `
MEMBER INTEREST CERTIFICATE

Close Corporation: ${client.name}
Registration: ${client.idOrRegNumber}

Date Issued: ${new Date(holding.dateJoined).toLocaleDateString('en-ZA')}

This certifies that:
${holding.firstName} ${holding.lastName}
ID Number: ${holding.idNumber}

holds a ${holding.memberInterest}% member interest in the Close Corporation

_______________________
Member Signature
    `;

    const blob = new Blob([certificateContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = isCompany 
      ? `Certificate_${activeCert.certificateNumber}_${holding.lastName}.txt`
      : `MemberInterest_${holding.lastName}.txt`;
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
      shareType: 'Ordinary',
      percentage: '',
      memberInterest: ''
    });
  };

  const resetTransferForm = () => {
    setTransferData({
      transferType: 'full',
      transferAmount: '',
      transferPercentage: '',
      shareType: 'Ordinary',
      newFirstName: '',
      newLastName: '',
      newIdNumber: '',
      newEmail: '',
      newPhone: '',
      transferDate: new Date().toISOString().split('T')[0]
    });
  };

  // Open modals
  const openAddModal = () => {
    resetForm();
    setFormData(prev => ({
      ...prev,
      certificateNumber: getNextCertificateNumber()
    }));
    setShowAddModal(true);
  };

  const openTransferModal = (holding) => {
    setSelectedHolding(holding);
    resetTransferForm();
    setTransferData(prev => ({
      ...prev,
      shareType: holding.shareType || 'Ordinary'
    }));
    setShowTransferModal(true);
  };

  const openHistoryModal = (holding) => {
    setSelectedHolding(holding);
    setShowHistoryModal(true);
  };

  const openCertificateHistoryModal = (holding) => {
    setSelectedHolding(holding);
    setShowCertificateHistoryModal(true);
  };

  // Calculate percentage for partial transfer
  const calculateTransferPercentage = () => {
    if (!transferData.transferAmount || !selectedHolding) return '';
    if (isCompany) {
      const totalShares = getTotalShares();
      return ((parseFloat(transferData.transferAmount) / totalShares) * 100).toFixed(2);
    }
    return transferData.transferAmount;
  };

  if (!isAvailable) {
    return (
      <div className="shares-members">
        <div className="module-header">
          <div className="header-content">
            <button className="back-btn" onClick={onBack}>← Back</button>
            <div className="module-title">
              <h1>Shares & Members Interest</h1>
              <p className="client-name">{client.name}</p>
            </div>
          </div>
        </div>
        <div className="not-available-container">
          <div className="not-available-message">
            <div className="not-available-icon">📋</div>
            <h2>Module Not Available</h2>
            <p>The Shares & Members Interest module is not applicable for {client.companyType}s.</p>
            <p className="small-text">This module is only available for Private Companies, Listed Companies, NPCs, and Close Corporations.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="shares-members">
      <div className="module-header">
        <div className="header-content">
          <button className="back-btn" onClick={onBack}>← Back</button>
          <div className="module-title">
            <h1>{isCC ? 'Members Interest' : 'Shares'}</h1>
            <p className="client-name">{client.name}</p>
          </div>
        </div>
        <button className="add-btn" onClick={openAddModal}>
          + Add {isCC ? 'Member' : 'Shareholder'}
        </button>
      </div>

      <div className="holdings-container">
        {holdings.length === 0 ? (
          <div className="no-holdings">
            <div className="no-holdings-icon">📊</div>
            <h2>No {isCC ? 'Members' : 'Shareholders'} Yet</h2>
            <p>Click the "Add {isCC ? 'Member' : 'Shareholder'}" button to get started.</p>
          </div>
        ) : (
          <div className="holdings-list">
            <div className={`list-header ${isCC ? 'cc-header' : ''}`}>
              {isCompany && <div>Cert #</div>}
              <div>Name</div>
              <div>ID Number</div>
              <div>Contact</div>
              {isCompany && (
                <>
                  <div>Share Type</div>
                  <div>Shares</div>
                  <div>Percentage</div>
                </>
              )}
              {isCC && <div>Interest (%)</div>}
              <div>Actions</div>
            </div>
            {holdings.map(holding => (
              <div key={holding.id} className={`holding-row ${isCC ? 'cc-row' : ''}`}>
                {isCompany && <div className="col-cert">{holding.certificateNumber}</div>}
                <div className="col-name">{holding.firstName} {holding.lastName}</div>
                <div className="col-id">{holding.idNumber}</div>
                <div className="col-contact">
                  {holding.email}
                  {holding.phone && <div className="phone-small">{holding.phone}</div>}
                </div>
                {isCompany && (
                  <>
                    <div className="col-shares">{holding.shareType}</div>
                    <div className="col-shares">{holding.shares?.toLocaleString()}</div>
                    <div className="col-percentage">{holding.percentage}%</div>
                  </>
                )}
                {isCC && <div className="col-interest">{holding.memberInterest}%</div>}
                <div className="col-actions">
                  <button 
                    className="action-btn download-btn" 
                    onClick={() => handleDownloadCertificate(holding)}
                    title="Download Certificate"
                  >
                    📥
                  </button>
                  <button 
                    className="action-btn transfer-btn" 
                    onClick={() => openTransferModal(holding)}
                    title="Transfer"
                  >
                    🔄
                  </button>
                  <button 
                    className="action-btn history-btn" 
                    onClick={() => openHistoryModal(holding)}
                    title="Transfer History"
                  >
                    📜
                  </button>
                  {isCompany && (
                    <button 
                      className="action-btn certificate-btn" 
                      onClick={() => openCertificateHistoryModal(holding)}
                      title="Certificate History"
                    >
                      🎫
                    </button>
                  )}
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
              <h2>Add {isCC ? 'Member' : 'Shareholder'}</h2>
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
                      <label>Share Type *</label>
                      <select
                        value={formData.shareType}
                        onChange={(e) => setFormData({...formData, shareType: e.target.value})}
                        className="form-select"
                      >
                        {shareTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
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
                {isCompany && (
                  <>
                    <p>{selectedHolding.shares?.toLocaleString()} {selectedHolding.shareType} shares ({selectedHolding.percentage}%)</p>
                    <p>Certificate: {selectedHolding.certificateNumber}</p>
                  </>
                )}
                {isCC && <p>{selectedHolding.memberInterest}% member interest</p>}
              </div>

              {/* Transfer Type Selection */}
              <div className="form-group full-width">
                <label>Transfer Type *</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      value="full"
                      checked={transferData.transferType === 'full'}
                      onChange={(e) => setTransferData({...transferData, transferType: e.target.value, transferAmount: ''})}
                    />
                    <span>Full Transfer</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      value="partial"
                      checked={transferData.transferType === 'partial'}
                      onChange={(e) => setTransferData({...transferData, transferType: e.target.value})}
                    />
                    <span>Partial Transfer</span>
                  </label>
                </div>
              </div>

              {/* Partial Transfer Amount */}
              {transferData.transferType === 'partial' && (
                <div className="transfer-amount-section">
                  <div className="form-group">
                    <label>{isCC ? 'Transfer Interest (%)' : 'Number of Shares to Transfer'} *</label>
                    <input
                      type="number"
                      step={isCC ? "0.01" : "1"}
                      value={transferData.transferAmount}
                      onChange={(e) => setTransferData({...transferData, transferAmount: e.target.value})}
                      placeholder={isCC ? "10.00" : "100"}
                      max={isCompany ? selectedHolding.shares : selectedHolding.memberInterest}
                    />
                    {isCompany && transferData.transferAmount && (
                      <small className="helper-text">
                        ≈ {calculateTransferPercentage()}% of total shares
                      </small>
                    )}
                  </div>
                  {isCompany && (
                    <div className="form-group">
                      <label>Share Type *</label>
                      <select
                        value={transferData.shareType}
                        onChange={(e) => setTransferData({...transferData, shareType: e.target.value})}
                        className="form-select"
                      >
                        {shareTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}

              <div className="transfer-arrow">→</div>

              {/* Recipient Information */}
              <div className="form-grid">
                <div className="form-group">
                  <label>Recipient First Name *</label>
                  <input
                    type="text"
                    value={transferData.newFirstName}
                    onChange={(e) => setTransferData({...transferData, newFirstName: e.target.value})}
                    placeholder="Enter first name"
                  />
                </div>
                <div className="form-group">
                  <label>Recipient Last Name *</label>
                  <input
                    type="text"
                    value={transferData.newLastName}
                    onChange={(e) => setTransferData({...transferData, newLastName: e.target.value})}
                    placeholder="Enter last name"
                  />
                </div>
                <div className="form-group">
                  <label>Recipient ID Number</label>
                  <input
                    type="text"
                    value={transferData.newIdNumber}
                    onChange={(e) => setTransferData({...transferData, newIdNumber: e.target.value})}
                    placeholder="Enter ID number"
                  />
                </div>
                <div className="form-group">
                  <label>Recipient Email</label>
                  <input
                    type="email"
                    value={transferData.newEmail}
                    onChange={(e) => setTransferData({...transferData, newEmail: e.target.value})}
                    placeholder="email@example.com"
                  />
                </div>
                <div className="form-group">
                  <label>Recipient Phone</label>
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

              {/* Transfer Summary */}
              {transferData.transferType === 'partial' && transferData.transferAmount && (
                <div className="transfer-summary">
                  <h4>Transfer Summary:</h4>
                  <ul>
                    <li>
                      <strong>Sender will retain:</strong> {' '}
                      {isCompany 
                        ? `${(selectedHolding.shares - parseFloat(transferData.transferAmount)).toLocaleString()} ${selectedHolding.shareType} shares`
                        : `${(selectedHolding.memberInterest - parseFloat(transferData.transferAmount)).toFixed(2)}%`
                      }
                    </li>
                    <li>
                      <strong>Recipient will receive:</strong> {' '}
                      {isCompany 
                        ? `${parseFloat(transferData.transferAmount).toLocaleString()} ${transferData.shareType} shares`
                        : `${parseFloat(transferData.transferAmount).toFixed(2)}%`
                      }
                    </li>
                    <li>
                      <strong>New certificates will be issued</strong> for both parties
                    </li>
                    <li>
                      <strong>Old certificate will be archived</strong>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowTransferModal(false)}>Cancel</button>
              <button className="submit-btn" onClick={handleTransfer}>
                {transferData.transferType === 'full' ? 'Transfer All' : 'Transfer Partial'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer History Modal */}
      {showHistoryModal && selectedHolding && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Transfer History</h2>
              <button className="close-btn" onClick={() => setShowHistoryModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <h3>{selectedHolding.firstName} {selectedHolding.lastName}</h3>
              {selectedHolding.transferHistory.length === 0 ? (
                <p className="no-history">No transfer history</p>
              ) : (
                <div className="history-list">
                  {selectedHolding.transferHistory.map((entry, index) => (
                    <div key={index} className="history-item">
                      <div className="history-date">
                        {new Date(entry.date).toLocaleDateString('en-ZA')}
                        {entry.type && <span className="history-badge">{entry.type.toUpperCase()}</span>}
                      </div>
                      <div className="history-transfer">
                        <div><strong>From:</strong> {entry.fromFirstName} {entry.fromLastName} ({entry.fromIdNumber})</div>
                        {entry.type !== 'received' && (
                          <div><strong>To:</strong> {entry.toFirstName} {entry.toLastName} ({entry.toIdNumber})</div>
                        )}
                        {isCompany && (
                          <>
                            <div><strong>Amount:</strong> {entry.shares?.toLocaleString()} {entry.shareType} shares ({entry.percentage}%)</div>
                            {entry.oldCertificate && <div><strong>Old Certificate:</strong> {entry.oldCertificate}</div>}
                            {entry.newCertificate && <div><strong>New Certificate:</strong> {entry.newCertificate}</div>}
                            {entry.recipientCertificate && <div><strong>Recipient Certificate:</strong> {entry.recipientCertificate}</div>}
                          </>
                        )}
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

      {/* Certificate History Modal */}
      {showCertificateHistoryModal && selectedHolding && isCompany && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Certificate History</h2>
              <button className="close-btn" onClick={() => setShowCertificateHistoryModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <h3>{selectedHolding.firstName} {selectedHolding.lastName}</h3>
              {!selectedHolding.certificateHistory || selectedHolding.certificateHistory.length === 0 ? (
                <p className="no-history">No certificate history</p>
              ) : (
                <div className="history-list">
                  {selectedHolding.certificateHistory
                    .slice()
                    .sort((a, b) => new Date(b.dateIssued) - new Date(a.dateIssued))
                    .map((cert, index) => (
                    <div key={index} className={`certificate-item ${cert.status}`}>
                      <div className="certificate-header">
                        <div className="certificate-number">Certificate #{cert.certificateNumber}</div>
                        <div className={`certificate-status ${cert.status}`}>
                          {cert.status === 'active' ? '✓ ACTIVE' : '📦 ARCHIVED'}
                        </div>
                      </div>
                      <div className="certificate-details">
                        <div><strong>Share Type:</strong> {cert.shareType}</div>
                        <div><strong>Shares:</strong> {cert.shares?.toLocaleString()}</div>
                        <div><strong>Percentage:</strong> {cert.percentage}%</div>
                        <div><strong>Date Issued:</strong> {new Date(cert.dateIssued).toLocaleDateString('en-ZA')}</div>
                        {cert.status === 'archived' && cert.archivedDate && (
                          <div><strong>Archived:</strong> {new Date(cert.archivedDate).toLocaleDateString('en-ZA')}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowCertificateHistoryModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SharesMembers;