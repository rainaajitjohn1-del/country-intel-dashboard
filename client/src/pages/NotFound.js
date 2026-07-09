import React from 'react';
import { useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.code}>404</h1>
      <h2 style={styles.title}>Page Not Found</h2>
      <p style={styles.message}>The page you're looking for doesn't exist or has been moved.</p>
      <div style={styles.buttons}>
        <button onClick={() => navigate('/')} style={styles.primaryBtn}>
          🏠 Go Home
        </button>
        <button onClick={() => navigate(-1)} style={styles.secondaryBtn}>
          ← Go Back
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f2f5', textAlign: 'center', padding: '2rem' },
  code: { fontSize: '8rem', fontWeight: 'bold', color: '#1a1a2e', margin: 0, lineHeight: 1 },
  title: { fontSize: '2rem', color: '#333', margin: '1rem 0 0.5rem' },
  message: { color: '#888', fontSize: '1.1rem', marginBottom: '2rem' },
  buttons: { display: 'flex', gap: '1rem' },
  primaryBtn: { padding: '0.75rem 2rem', backgroundColor: '#1a1a2e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem' },
  secondaryBtn: { padding: '0.75rem 2rem', backgroundColor: 'white', color: '#1a1a2e', border: '1px solid #1a1a2e', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem' },
};

export default NotFound;