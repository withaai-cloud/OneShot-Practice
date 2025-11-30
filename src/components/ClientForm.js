import React, { useState, useEffect } from 'react';
import './ClientForm.css';

function ClientForm({ client, onSave, onCancel, isPractice, practiceName }) {
  const [formData, setFormData] = useState({
    name: '',
    idOrRegNumber: '',
    companyType: '',
    financialYearEnd: '',
    vatSequence: '',
    taxNumber: '',
    vatNumber: '',
    payeNumber: '',
    uifNumber: '',
    coidaNumber: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    modules: {
      accounting: false,
      assets: false,
      payroll: false,
      tax: false,
      shares: false,
      statutory: false
    }
  });

  // If editing, populate form with existing client data
  useEffect(() => {
    if (client) {
      setFormData(client);
    }
  }, [client]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleModuleChange = (moduleName) => {
    setFormData({
      ...formData,
      modules: {
        ...formData.modules,
        [moduleName]: !formData.modules[moduleName]
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="client-form-overlay">
      <div className="client-form-container">
        <div className="form-header">
          <h2>{client ? 'Edit Client' : 'Add New Client'}</h2>
          <button className="close-btn" onClick={onCancel}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="client-form">
          {/* Company Information */}
          <div className="form-section">
            <h3>Company Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Company Name *</label>
                <input
                  type="text"
                  name="name"
                  value={isPractice ? practiceName : formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter company name"
                  disabled={isPractice}
                  style={isPractice ? { backgroundColor: '#F0F0F0', cursor: 'not-allowed' } : {}}
                />
                {isPractice && (
                  <small className="help-text">Practice name cannot be changed here</small>
                )}
              </div>
              <div className="form-group">
                <label>ID / Company Registration *</label>
                <input
                  type="text"
                  name="idOrRegNumber"
                  value={formData.idOrRegNumber}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 2000/123456/07"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Company Type *</label>
                <select
                  name="companyType"
                  value={formData.companyType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Company Type</option>
                  <option value="Listed Company">Listed Company</option>
                  <option value="Private Company">Private Company</option>
                  <option value="Closed Corporation">Closed Corporation</option>
                  <option value="Trust">Trust</option>
                  <option value="Individual">Individual</option>
                  <option value="NPO">NPO (Non-Profit Organisation)</option>
                  <option value="NPC">NPC (Non-Profit Company)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Financial Year End *</label>
                <input
                  type="date"
                  name="financialYearEnd"
                  value={formData.financialYearEnd}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Tax Information */}
          <div className="form-section">
            <h3>Tax Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Tax Number</label>
                <input
                  type="text"
                  name="taxNumber"
                  value={formData.taxNumber}
                  onChange={handleChange}
                  placeholder="e.g., 9999999999"
                />
              </div>
              <div className="form-group">
                <label>VAT Number</label>
                <input
                  type="text"
                  name="vatNumber"
                  value={formData.vatNumber}
                  onChange={handleChange}
                  placeholder="e.g., 4999999999"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>VAT Sequence</label>
                <select
                  name="vatSequence"
                  value={formData.vatSequence}
                  onChange={handleChange}
                >
                  <option value="">Select VAT Sequence</option>
                  <option value="Monthly">Monthly</option>
                  <option value="2 Monthly Even">2 Monthly Even</option>
                  <option value="2 Monthly Odd">2 Monthly Odd</option>
                  <option value="Every 6 Months">Every 6 Months</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>PAYE Number</label>
                <input
                  type="text"
                  name="payeNumber"
                  value={formData.payeNumber}
                  onChange={handleChange}
                  placeholder="e.g., 7999999999"
                />
              </div>
              <div className="form-group">
                <label>UIF Number</label>
                <input
                  type="text"
                  name="uifNumber"
                  value={formData.uifNumber}
                  onChange={handleChange}
                  placeholder="e.g., U999999999"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>COIDA Number</label>
                <input
                  type="text"
                  name="coidaNumber"
                  value={formData.coidaNumber}
                  onChange={handleChange}
                  placeholder="e.g., C999999999"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="form-section">
            <h3>Contact Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Contact Person</label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  placeholder="Enter contact person name"
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@company.co.za"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g., 011 123 4567"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="form-section">
            <h3>Address Information</h3>
            <div className="form-group full-width">
              <label>Street Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter street address"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g., Johannesburg"
                />
              </div>
              <div className="form-group">
                <label>Province</label>
                <select
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                >
                  <option value="">Select Province</option>
                  <option value="Gauteng">Gauteng</option>
                  <option value="Western Cape">Western Cape</option>
                  <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                  <option value="Eastern Cape">Eastern Cape</option>
                  <option value="Free State">Free State</option>
                  <option value="Limpopo">Limpopo</option>
                  <option value="Mpumalanga">Mpumalanga</option>
                  <option value="Northern Cape">Northern Cape</option>
                  <option value="North West">North West</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="e.g., 2000"
                />
              </div>
            </div>
          </div>

          {/* Module Selection */}
          <div className="form-section">
            <h3>Available Modules</h3>
            <p className="section-description">Select which modules this client will have access to</p>
            <div className="modules-selection">
              <label className="module-checkbox">
                <input
                  type="checkbox"
                  checked={formData.modules.accounting}
                  onChange={() => handleModuleChange('accounting')}
                />
                <span className="module-label">
                  <span className="module-icon">📊</span>
                  <span className="module-text">Accounting</span>
                </span>
              </label>
              <label className="module-checkbox">
                <input
                  type="checkbox"
                  checked={formData.modules.assets}
                  onChange={() => handleModuleChange('assets')}
                />
                <span className="module-label">
                  <span className="module-icon">💼</span>
                  <span className="module-text">Asset Manager</span>
                </span>
              </label>
              <label className="module-checkbox">
                <input
                  type="checkbox"
                  checked={formData.modules.payroll}
                  onChange={() => handleModuleChange('payroll')}
                />
                <span className="module-label">
                  <span className="module-icon">💰</span>
                  <span className="module-text">Payroll</span>
                </span>
              </label>
              <label className="module-checkbox">
                <input
                  type="checkbox"
                  checked={formData.modules.tax}
                  onChange={() => handleModuleChange('tax')}
                />
                <span className="module-label">
                  <span className="module-icon">📑</span>
                  <span className="module-text">Tax Management</span>
                </span>
              </label>
              <label className="module-checkbox">
                <input
                  type="checkbox"
                  checked={formData.modules.shares}
                  onChange={() => handleModuleChange('shares')}
                />
                <span className="module-label">
                  <span className="module-icon">📈</span>
                  <span className="module-text">Shares & Members</span>
                </span>
              </label>
              <label className="module-checkbox">
                <input
                  type="checkbox"
                  checked={formData.modules.statutory}
                  onChange={() => handleModuleChange('statutory')}
                />
                <span className="module-label">
                  <span className="module-icon">📋</span>
                  <span className="module-text">Statutory Documents</span>
                </span>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              {client ? 'Update Client' : 'Add Client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ClientForm;