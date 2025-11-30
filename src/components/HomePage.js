import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="home-page">
      {/* Header */}
      <header className="home-header">
        <div className="logo-container">
          <img src={require('../assets/images/header.png')} alt="OneShot Practice" className="header-logo" />
        </div>
        <button className="login-btn" onClick={handleGetStarted}>
          Login
        </button>
      </header>

      {/* Hero Section */}
      <main className="home-main">
        <div className="hero-content">
          <h1>Complete Practice Management</h1>
          <p className="hero-subtitle">
            Streamline your accounting practice with comprehensive tools for client management, 
            accounting, payroll, assets, tax compliance, and more.
          </p>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Accounting</h3>
              <p>Full-featured accounting tools for all your client needs</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">💼</div>
              <h3>Asset Manager</h3>
              <p>Track and manage client assets with ease</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Payroll</h3>
              <p>Comprehensive payroll processing for South African businesses</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📑</div>
              <h3>Tax Management</h3>
              <p>SARS-compliant tax calculations and submissions</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Shares & Members</h3>
              <p>Manage shareholding structures and member interests</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📋</div>
              <h3>Statutory Documents</h3>
              <p>Store and manage all statutory documentation</p>
            </div>
          </div>

          <button className="cta-button" onClick={handleGetStarted}>
            Get Started
          </button>
        </div>

        {/* Background Logo */}
        <div className="background-logo">
          <img src={require('../assets/images/home.png')} alt="" />
        </div>
      </main>

      {/* Footer */}
      <footer className="home-footer">
        <p>&copy; 2024 OneShot Practice. Built for South African Accounting Professionals.</p>
      </footer>
    </div>
  );
}

export default HomePage;