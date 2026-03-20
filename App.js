import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OnboardingPage from './pages/OnboardingPage';
import PlanSelectionPage from './pages/PlanSelectionPage';
import DashboardPage from './pages/DashboardPage';
import ClaimHistoryPage from './pages/ClaimHistoryPage';
import PendingClaimsPage from './pages/PendingClaimsPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLogin = (token, userData) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {!isAuthenticated ? (
            <>
              <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
              <Route path="/signup" element={<SignupPage onSignup={handleLogin} />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          ) : (
            <>
              {!user?.onboardingComplete && (
                <Route path="/onboarding" element={<OnboardingPage user={user} setUser={setUser} />} />
              )}
              {!user?.activeSubscription && (
                <Route path="/plans" element={<PlanSelectionPage user={user} setUser={setUser} />} />
              )}
              <Route path="/dashboard" element={<DashboardPage user={user} />} />
              <Route path="/history" element={<ClaimHistoryPage user={user} />} />
              <Route path="/pending" element={<PendingClaimsPage user={user} />} />
              <Route path="/profile" element={<ProfilePage user={user} setUser={setUser} />} />
              <Route path="/logout" element={<LogoutPage onLogout={handleLogout} />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

function LogoutPage({ onLogout }) {
  useEffect(() => {
    onLogout();
  }, [onLogout]);

  return <Navigate to="/login" />;
}

export default App;
