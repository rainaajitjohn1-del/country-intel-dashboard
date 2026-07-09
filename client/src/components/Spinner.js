import React from 'react';

function Spinner({ message = 'Loading...' }) {
  return (
    <div style={styles.container}>
      <div style={styles.spinner}></div>
      <p style={styles.message}>{message}</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem',
    minHeight: '300px',
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid #f0f2f5',
    borderTop: '4px solid #1a1a2e',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    marginBottom: '1rem',
  },
  message: {
    color: '#888',
    fontSize: '1rem',
  },
};

export default Spinner;