import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  // State to track if user is logged in and their role
  const [user, setUser] = useState(null);
  
  // State to store registered users (in real app, this would be in database)
  const [registeredUsers, setRegisteredUsers] = useState([
    // Demo users
    { email: 'super@oneshot.co.za', password: 'super123', role: 'Super User', userType: 'super', fullName: 'Super User Demo', practiceName: 'Demo Practice' },
    { email: 'accounting@oneshot.co.za', password: 'acc123', role: 'Accounting User', userType: 'accounting', fullName: 'Accounting Demo', practiceName: 'Demo Practice' },
    { email: 'client@oneshot.co.za', password: 'client123', role: 'Client User', userType: 'client', fullName: 'Client Demo' }
  ]);

  // Function to handle login
  const handleLogin = (userData) => {
    setUser(userData);
  };

  // Function to handle registration
  const handleRegister = (userData) => {
    // Add new user to registered users
    const newUser = {
      email: userData.email,
      password: userData.password,
      role: userData.role,
      userType: userData.userType,
      fullName: userData.fullName,
      practiceName: userData.practiceName
    };
    setRegisteredUsers([...registeredUsers, newUser]);
    console.log('User registered:', newUser);
  };

  // Function to handle logout
  const handleLogout = () => {
    setUser(null);
  };

  // Get list of existing practice names
  const getExistingPractices = () => {
    const practices = registeredUsers
      .filter(u => u.practiceName)
      .map(u => u.practiceName);
    return [...new Set(practices)]; // Remove duplicates
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Home Page Route */}
          <Route path="/" element={<HomePage />} />
          
          {/* Login Page Route */}
          <Route 
            path="/login" 
            element={
              user ? <Navigate to="/dashboard" /> : <LoginPage onLogin={handleLogin} registeredUsers={registeredUsers} />
            } 
          />
          
          {/* Register Page Route */}
          <Route 
            path="/register" 
            element={
              user ? <Navigate to="/dashboard" /> : <RegisterPage onRegister={handleRegister} existingPractices={getExistingPractices()} />
            } 
          />
          
          {/* Dashboard Route - Protected */}
          <Route 
            path="/dashboard" 
            element={
              user ? (
                <Dashboard 
                  user={user} 
                  onLogout={handleLogout} 
                  onAddUser={handleRegister}
                  allUsers={registeredUsers}
                />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;