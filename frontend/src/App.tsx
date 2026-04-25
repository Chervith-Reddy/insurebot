import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SubmitClaimPage from './pages/SubmitClaimPage';
import TrackClaimPage from './pages/TrackClaimPage';
import AdminPage from './pages/AdminPage';
import './index.css';

const App: React.FC = () => {
  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/submit-claim" element={<SubmitClaimPage />} />
            <Route path="/track-claim" element={<TrackClaimPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route
              path="*"
              element={
                <div className="page-container" style={{ textAlign: 'center', paddingTop: 80 }}>
                  <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
                  <h1 style={{ fontSize: 48, fontWeight: 900, color: '#1e3a8a', marginBottom: 16 }}>404</h1>
                  <p style={{ color: '#6b7280', marginBottom: 24, fontSize: 18 }}>Page not found</p>
                  <a href="/" className="btn btn-primary">
                    ← Go Home
                  </a>
                </div>
              }
            />
          </Routes>
        </main>
        <footer
          style={{
            background: '#1e3a8a',
            color: 'rgba(255,255,255,0.7)',
            textAlign: 'center',
            padding: '20px',
            fontSize: 13,
          }}
        >
          <p>🛡️ InsureBot — AI-Powered Insurance Claims Assistant © {new Date().getFullYear()}</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
