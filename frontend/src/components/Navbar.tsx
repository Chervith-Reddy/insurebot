import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/submit-claim', label: 'Submit Claim' },
    { path: '/track-claim', label: 'Track Claim' },
    { path: '/admin', label: 'Admin' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo} onClick={() => setMenuOpen(false)}>
          <span style={styles.logoIcon}>🛡️</span>
          <span style={styles.logoText}>InsureBot</span>
        </Link>

        <button
          style={styles.menuToggle}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <ul style={{ ...styles.navLinks, ...(menuOpen ? styles.navLinksOpen : {}) }}>
          {navLinks.map(({ path, label }) => (
            <li key={path}>
              <Link
                to={path}
                style={{
                  ...styles.navLink,
                  ...(isActive(path) ? styles.navLinkActive : {}),
                }}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

const styles: Record<string, React.CSSProperties> = {
  nav: {
    background: 'linear-gradient(135deg, #1e3a8a, #1e40af)',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  container: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 20px',
    height: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    textDecoration: 'none',
  },
  logoIcon: {
    fontSize: 28,
  },
  logoText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 800,
    letterSpacing: '-0.5px',
  },
  navLinks: {
    display: 'flex',
    listStyle: 'none',
    gap: 4,
    margin: 0,
    padding: 0,
  },
  navLinksOpen: {},
  navLink: {
    color: 'rgba(255,255,255,0.8)',
    textDecoration: 'none',
    padding: '8px 14px',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    transition: 'all 0.2s',
    display: 'block',
  },
  navLinkActive: {
    color: 'white',
    background: 'rgba(255,255,255,0.15)',
    fontWeight: 600,
  },
  menuToggle: {
    display: 'none',
    background: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: 22,
    cursor: 'pointer',
  },
};

export default Navbar;
