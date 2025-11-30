import React, { useState } from 'react';
import ClientForm from './ClientForm';
import ClientListItem from './ClientListItem';
import AssignClientModal from './AssignClientModal';
import AddUserModal from './AddUserModal';
import TransferClientModal from './TransferClientModal';
import StatutoryDocuments from './StatutoryDocuments';
import SharesMembers from './SharesMembers';
import PracticeDashboard from './PracticeDashboard';
import './Dashboard.css';

function Dashboard({ user, onLogout, onAddUser, allUsers }) {
  const [clients, setClients] = useState([
    // Demo client for testing
    {
      id: 1,
      name: 'ABC Trading (Pty) Ltd',
      idOrRegNumber: '2015/123456/07',
      companyType: 'Private Company',
      financialYearEnd: '2025-02-28',
      vatSequence: 'Monthly',
      taxNumber: '9876543210',
      vatNumber: '4123456789',
      payeNumber: '7234567890',
      uifNumber: 'U345678901',
      coidaNumber: 'C456789012',
      contactPerson: 'John Smith',
      email: 'john@abctrading.co.za',
      phone: '011 234 5678',
      address: '123 Main Street',
      city: 'Johannesburg',
      province: 'Gauteng',
      postalCode: '2000',
      sharedWith: ['accounting@oneshot.co.za'],
      createdBy: 'super@oneshot.co.za',
      modules: {
        accounting: true,
        assets: true,
        payroll: true,
        tax: true,
        shares: false,
        statutory: true
      }
    }
  ]);

  const [showClientForm, setShowClientForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assigningClient, setAssigningClient] = useState(null);
  const [expandedClientId, setExpandedClientId] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferringClient, setTransferringClient] = useState(null);
  
  // Module navigation state
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'practice', or module name
  const [selectedClient, setSelectedClient] = useState(null);
  
  // Practice company state
  const [practiceCompany, setPracticeCompany] = useState(null);
  const [showPracticeSetup, setShowPracticeSetup] = useState(false);
  const [showPracticeView, setShowPracticeView] = useState(false);

  // Handle toggle expansion - only one open at a time
  const handleToggleExpand = (clientId) => {
    setExpandedClientId(expandedClientId === clientId ? null : clientId);
  };

  // Add or Update Client
  const handleSaveClient = (clientData) => {
    if (editingClient) {
      // Update existing client
      setClients(clients.map(c => 
        c.id === editingClient.id ? { ...clientData, id: c.id, sharedWith: c.sharedWith, createdBy: c.createdBy } : c
      ));
    } else {
      // Add new client - ensure modules is included
      const newClient = {
        ...clientData,
        id: Date.now(),
        sharedWith: [],
        createdBy: user.email,
        modules: clientData.modules || {
          accounting: false,
          assets: false,
          payroll: false,
          tax: false,
          shares: false,
          statutory: false
        }
      };
      setClients([...clients, newClient]);
    }
    setShowClientForm(false);
    setEditingClient(null);
  };

  // Delete Client - only if user created it
  const handleDeleteClient = (clientId) => {
    const clientToDelete = clients.find(c => c.id === clientId);
    if (clientToDelete && clientToDelete.createdBy === user.email) {
      setClients(clients.filter(c => c.id !== clientId));
    } else {
      alert('You can only delete clients you created.');
    }
  };

  // Open Edit Form
  const handleEditClient = (client) => {
    setEditingClient(client);
    setShowClientForm(true);
  };

  // Open Assign Modal
  const handleOpenAssign = (client) => {
    setAssigningClient(client);
    setShowAssignModal(true);
  };

  // Save Client Assignment
  const handleAssignClient = (clientId, assignedUsers) => {
    setClients(clients.map(c => 
      c.id === clientId ? { ...c, sharedWith: assignedUsers } : c
    ));
    setShowAssignModal(false);
    setAssigningClient(null);
  };

  // Close Forms/Modals
  const handleCloseForm = () => {
    setShowClientForm(false);
    setEditingClient(null);
  };

  const handleCloseAssign = () => {
    setShowAssignModal(false);
    setAssigningClient(null);
  };

  // Add User (Super User only)
  const handleAddUser = (userData) => {
    onAddUser(userData);
    setShowAddUserModal(false);
    alert(`User ${userData.fullName} added successfully!`);
  };

  // Get users from the same practice for assignment
  const getPracticeUsers = () => {
    if (user.userType === 'client') {
      // Client users can assign to any email
      return [];
    } else {
      // Super/Accounting users can only assign to users in their practice
      return allUsers.filter(u => u.practiceName === user.practiceName && u.email !== user.email);
    }
  };

  // Open Transfer Modal
  const handleOpenTransfer = (client) => {
    setTransferringClient(client);
    setShowTransferModal(true);
  };

  // Transfer Client
  const handleTransferClient = (clientId, newOwnerEmail) => {
    setClients(clients.map(c => 
      c.id === clientId ? { ...c, createdBy: newOwnerEmail } : c
    ));
    setShowTransferModal(false);
    setTransferringClient(null);
    alert('Client transferred successfully!');
  };

  // Handle Module Click
  const handleModuleClick = (client, moduleName) => {
    setSelectedClient(client);
    setCurrentView(moduleName);
  };

  // Back to Dashboard
  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedClient(null);
  };

  // Back to Practice
  const handleBackToPractice = () => {
    setCurrentView('practice');
    setSelectedClient(practiceCompany);
  };

  // Handle Practice Click
  const handlePracticeClick = () => {
    if (!practiceCompany) {
      // First time - show setup modal
      setShowPracticeSetup(true);
    } else {
      // Practice company exists - go to practice dashboard
      setShowPracticeView(true);
    }
  };

  // Save Practice Company
  const handleSavePracticeCompany = (companyData) => {
    const practiceData = {
      ...companyData,
      id: 'practice-' + Date.now(),
      name: user.practiceName,
      isPractice: true
    };
    setPracticeCompany(practiceData);
    setShowPracticeSetup(false);
    // Automatically go to practice view after setup
    setShowPracticeView(true);
  };

  // Update Practice Company
  const handleUpdatePracticeCompany = (companyData) => {
    const updatedPractice = {
      ...companyData,
      id: practiceCompany.id,
      name: user.practiceName,
      isPractice: true
    };
    setPracticeCompany(updatedPractice);
  };

  // Back from Practice to Dashboard
  const handleBackFromPractice = () => {
    setShowPracticeView(false);
  };

  // Render Module View
  const renderModuleView = () => {
    switch(currentView) {
      case 'accounting':
        return <div className="module-placeholder">
          <h2>📊 Accounting Module</h2>
          <p>For: {selectedClient.name}</p>
          <p>Coming soon...</p>
        </div>;
      case 'assets':
        return <div className="module-placeholder">
          <h2>💼 Asset Manager Module</h2>
          <p>For: {selectedClient.name}</p>
          <p>Coming soon...</p>
        </div>;
      case 'payroll':
        return <div className="module-placeholder">
          <h2>💰 Payroll Module</h2>
          <p>For: {selectedClient.name}</p>
          <p>Coming soon...</p>
        </div>;
      case 'tax':
        return <div className="module-placeholder">
          <h2>📑 Tax Management Module</h2>
          <p>For: {selectedClient.name}</p>
          <p>Coming soon...</p>
        </div>;
      case 'shares':
        return <SharesMembers client={selectedClient} onBack={handleBackToDashboard} />;
      case 'statutory':
        return <StatutoryDocuments client={selectedClient} onBack={handleBackToDashboard} />;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard">
      {showPracticeView ? (
        <PracticeDashboard 
          practiceCompany={practiceCompany}
          onUpdatePractice={handleUpdatePracticeCompany}
          onBack={handleBackFromPractice}
          user={user}
        />
      ) : (
        <>
          {/* Header */}
          <header className="dashboard-header">
        <div className="logo-container">
          <img src={require('../assets/images/header.png')} alt="OneShot Practice" className="header-logo" />
        </div>
        {user.practiceName && (
          <div className="practice-name-display" onClick={handlePracticeClick} style={{ cursor: 'pointer' }}>
            <span className="practice-label">Practice:</span>
            <span className="practice-name">{user.practiceName}</span>
          </div>
        )}
        <div className="user-info">
          <span className="user-role">{user.role}</span>
          <span className="user-email">{user.email}</span>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {currentView === 'dashboard' ? (
          <>
            <div className="dashboard-header-section">
              <div>
                <h1>Client Management</h1>
                <p className="subtitle">Manage your clients and their information</p>
              </div>
              <div className="header-actions">
                {user.userType === 'super' && (
                  <button 
                    className="add-user-btn"
                    onClick={() => setShowAddUserModal(true)}
                  >
                    👤 Add Accounting User
                  </button>
                )}
                <button 
                  className="add-client-btn"
                  onClick={() => setShowClientForm(true)}
                >
                  ➕ Add New Client
                </button>
              </div>
            </div>

            {/* Client List */}
            <div className="client-list">
              {clients.length === 0 ? (
                <div className="no-clients">
                  <div className="no-clients-icon">📋</div>
                  <h2>No Clients Yet</h2>
                  <p>Get started by adding your first client using the button above.</p>
                </div>
              ) : (
                clients.map(client => (
                  <ClientListItem
                    key={client.id}
                    client={client}
                    onEdit={handleEditClient}
                    onDelete={handleDeleteClient}
                    onAssign={handleOpenAssign}
                    onTransfer={handleOpenTransfer}
                    onModuleClick={handleModuleClick}
                    currentUser={user}
                    isExpanded={expandedClientId === client.id}
                    onToggle={handleToggleExpand}
                    canDelete={client.createdBy === user.email}
                  />
                ))
              )}
            </div>
          </>
        ) : (
          <>
            {renderModuleView()}
          </>
        )}
      </main>

      {/* Client Form Modal */}
      {showClientForm && (
        <ClientForm
          client={editingClient}
          onSave={handleSaveClient}
          onCancel={handleCloseForm}
        />
      )}

      {/* Practice Setup Modal */}
      {showPracticeSetup && (
        <ClientForm
          client={practiceCompany}
          onSave={handleSavePracticeCompany}
          onCancel={() => setShowPracticeSetup(false)}
          isPractice={true}
          practiceName={user.practiceName}
        />
      )}

      {/* Assign Client Modal */}
      {showAssignModal && assigningClient && (
        <AssignClientModal
          client={assigningClient}
          onAssign={handleAssignClient}
          onCancel={handleCloseAssign}
          practiceUsers={getPracticeUsers()}
          userType={user.userType}
        />
      )}

      {/* Add User Modal (Super User only) */}
      {showAddUserModal && (
        <AddUserModal
          onAddUser={handleAddUser}
          onCancel={() => setShowAddUserModal(false)}
          practiceName={user.practiceName}
        />
      )}

      {/* Transfer Client Modal (Super User only) */}
      {showTransferModal && transferringClient && (
        <TransferClientModal
          client={transferringClient}
          onTransfer={handleTransferClient}
          onCancel={() => {
            setShowTransferModal(false);
            setTransferringClient(null);
          }}
          allUsers={allUsers}
          currentUserEmail={user.email}
        />
      )}
    </>
  )}
    </div>
  );
}

export default Dashboard;