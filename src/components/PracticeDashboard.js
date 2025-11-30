import React, { useState } from 'react';
import StatutoryDocuments from './StatutoryDocuments';
import SharesMembers from './SharesMembers';
import TimeBilling from './TimeBilling';
import ClientForm from './ClientForm';
import './PracticeDashboard.css';

function PracticeDashboard({ practiceCompany, onUpdatePractice, onBack, user }) {
  const [currentView, setCurrentView] = useState('modules'); // 'modules', 'accounting', 'assets', etc.
  const [showPracticeEdit, setShowPracticeEdit] = useState(false);

  // Handle module click
  const handleModuleClick = (moduleName) => {
    setCurrentView(moduleName);
  };

  // Back to practice modules
  const handleBackToModules = () => {
    setCurrentView('modules');
  };

  // Handle practice update
  const handleSavePractice = (updatedData) => {
    onUpdatePractice(updatedData);
    setShowPracticeEdit(false);
  };

  // Render module view
  const renderModuleView = () => {
    switch(currentView) {
      case 'accounting':
        return (
          <div className="module-placeholder">
            <button className="back-btn" onClick={handleBackToModules}>
              ← Back to Practice
            </button>
            <h2>📊 Accounting Module</h2>
            <p>For: {practiceCompany.name}</p>
            <p>Coming soon...</p>
          </div>
        );
      case 'assets':
        return (
          <div className="module-placeholder">
            <button className="back-btn" onClick={handleBackToModules}>
              ← Back to Practice
            </button>
            <h2>💼 Asset Manager Module</h2>
            <p>For: {practiceCompany.name}</p>
            <p>Coming soon...</p>
          </div>
        );
      case 'payroll':
        return (
          <div className="module-placeholder">
            <button className="back-btn" onClick={handleBackToModules}>
              ← Back to Practice
            </button>
            <h2>💰 Payroll Module</h2>
            <p>For: {practiceCompany.name}</p>
            <p>Coming soon...</p>
          </div>
        );
      case 'tax':
        return (
          <div className="module-placeholder">
            <button className="back-btn" onClick={handleBackToModules}>
              ← Back to Practice
            </button>
            <h2>📑 Tax Management Module</h2>
            <p>For: {practiceCompany.name}</p>
            <p>Coming soon...</p>
          </div>
        );
      case 'shares':
        return (
          <SharesMembers client={practiceCompany} onBack={handleBackToModules} />
        );
      case 'statutory':
        return <StatutoryDocuments client={practiceCompany} onBack={handleBackToModules} />;
      case 'timebilling':
        return <TimeBilling practice={practiceCompany} onBack={handleBackToModules} />;
      default:
        return null;
    }
  };

  return (
    <div className="practice-dashboard">
      {currentView === 'modules' ? (
        <>
          {/* Header */}
          <div className="practice-header">
            <div className="header-content">
              <button className="back-btn" onClick={onBack}>
                ← Back to Dashboard
              </button>
              <div className="practice-title">
                <h1>🏢 {practiceCompany.name}</h1>
                <p className="practice-subtitle">Practice Company</p>
              </div>
            </div>
            <div className="header-actions">
              <button className="time-billing-btn" onClick={() => setCurrentView('timebilling')}>
                ⏱️ Time & Billing
              </button>
              <button className="edit-practice-btn" onClick={() => setShowPracticeEdit(true)}>
                ✏️ Edit Practice Details
              </button>
            </div>
          </div>

          {/* Modules Grid */}
          <div className="practice-modules-container">
            <div className="modules-section">
              <h2>Practice Modules</h2>
              <div className="practice-modules-grid">
                {practiceCompany.modules?.accounting && (
                  <button 
                    className="practice-module-btn accounting-module"
                    onClick={() => handleModuleClick('accounting')}
                  >
                    <span className="module-icon">📊</span>
                    <span className="module-name">Accounting</span>
                  </button>
                )}
                {practiceCompany.modules?.assets && (
                  <button 
                    className="practice-module-btn assets-module"
                    onClick={() => handleModuleClick('assets')}
                  >
                    <span className="module-icon">💼</span>
                    <span className="module-name">Asset Manager</span>
                  </button>
                )}
                {practiceCompany.modules?.payroll && (
                  <button 
                    className="practice-module-btn payroll-module"
                    onClick={() => handleModuleClick('payroll')}
                  >
                    <span className="module-icon">💰</span>
                    <span className="module-name">Payroll</span>
                  </button>
                )}
                {practiceCompany.modules?.tax && (
                  <button 
                    className="practice-module-btn tax-module"
                    onClick={() => handleModuleClick('tax')}
                  >
                    <span className="module-icon">📑</span>
                    <span className="module-name">Tax Management</span>
                  </button>
                )}
                {practiceCompany.modules?.shares && (
                  <button 
                    className="practice-module-btn shares-module"
                    onClick={() => handleModuleClick('shares')}
                  >
                    <span className="module-icon">📈</span>
                    <span className="module-name">Shares & Members</span>
                  </button>
                )}
                {practiceCompany.modules?.statutory && (
                  <button 
                    className="practice-module-btn statutory-module"
                    onClick={() => handleModuleClick('statutory')}
                  >
                    <span className="module-icon">📋</span>
                    <span className="module-name">Statutory Documents</span>
                  </button>
                )}
              </div>
              {(!practiceCompany.modules || Object.values(practiceCompany.modules).every(v => !v)) && (
                <p className="no-modules-message">No modules enabled for this practice</p>
              )}
            </div>

            {/* Practice Details */}
            <div className="practice-details-section">
              <h2>Practice Details</h2>
              
              {/* Company Information */}
              <div className="details-section">
                <h3>Company Information</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Company Type:</span>
                    <span className="detail-value">{practiceCompany.companyType || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Financial Year End:</span>
                    <span className="detail-value">
                      {practiceCompany.financialYearEnd 
                        ? new Date(practiceCompany.financialYearEnd).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Registration Number:</span>
                    <span className="detail-value">{practiceCompany.idOrRegNumber || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Tax Information */}
              <div className="details-section">
                <h3>Tax Information</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Tax Number:</span>
                    <span className="detail-value">{practiceCompany.taxNumber || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">VAT Number:</span>
                    <span className="detail-value">{practiceCompany.vatNumber || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">VAT Sequence:</span>
                    <span className="detail-value">{practiceCompany.vatSequence || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">PAYE Number:</span>
                    <span className="detail-value">{practiceCompany.payeNumber || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">UIF Number:</span>
                    <span className="detail-value">{practiceCompany.uifNumber || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">COIDA Number:</span>
                    <span className="detail-value">{practiceCompany.coidaNumber || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="details-section">
                <h3>Contact Information</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Contact Person:</span>
                    <span className="detail-value">{practiceCompany.contactPerson || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{practiceCompany.email || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">{practiceCompany.phone || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="details-section">
                <h3>Address Information</h3>
                <div className="details-grid">
                  <div className="detail-item full-width">
                    <span className="detail-label">Address:</span>
                    <span className="detail-value">
                      {practiceCompany.address && (
                        <>
                          {practiceCompany.address}
                          {practiceCompany.city && `, ${practiceCompany.city}`}
                          {practiceCompany.province && `, ${practiceCompany.province}`}
                          {practiceCompany.postalCode && `, ${practiceCompany.postalCode}`}
                        </>
                      )}
                      {!practiceCompany.address && 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        renderModuleView()
      )}

      {/* Edit Practice Modal */}
      {showPracticeEdit && (
        <ClientForm
          client={practiceCompany}
          onSave={handleSavePractice}
          onCancel={() => setShowPracticeEdit(false)}
          isPractice={true}
          practiceName={user.practiceName}
        />
      )}
    </div>
  );
}

export default PracticeDashboard;