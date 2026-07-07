import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>🌍 NationIQ</Link>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/compare" style={styles.link}>Compare</Link>
        <Link to="/travel" style={styles.link}>Travel</Link>
        {user ? (
          <>
            <Link to="/watchlist" style={styles.link}>⭐ Watchlist</Link>
            <span style={styles.username}>👤 {user.name}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.registerBtn}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', backgroundColor: '#1a1a2e', color: 'white' },
  brand: { color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' },
  links: { display: 'flex', gap: '1.5rem', alignItems: 'center' },
  link: { color: 'white', textDecoration: 'none', fontSize: '1rem' },
  username: { color: '#aaa', fontSize: '0.9rem' },
  logoutBtn: { backgroundColor: 'transparent', color: 'white', border: '1px solid white', padding: '0.3rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' },
  registerBtn: { backgroundColor: '#e94560', color: 'white', textDecoration: 'none', padding: '0.4rem 1rem', borderRadius: '6px', fontSize: '0.9rem' },
};

export default Navbar;