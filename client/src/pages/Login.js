import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🌍 Welcome Back</h1>
        <p style={styles.subtitle}>Login to access your NationIQ account</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="your@email.com"
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={styles.link}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  card: { backgroundColor: 'white', padding: '3rem', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', width: '100%', maxWidth: '420px' },
  title: { fontSize: '2rem', margin: '0 0 0.5rem', color: '#1a1a2e', textAlign: 'center' },
  subtitle: { color: '#888', textAlign: 'center', marginBottom: '2rem' },
  error: { backgroundColor: '#fce4ec', color: '#e91e63', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' },
  field: { marginBottom: '1.5rem' },
  label: { display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333', fontSize: '0.9rem' },
  input: { width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' },
  button: { width: '100%', padding: '0.875rem', backgroundColor: '#1a1a2e', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer', fontWeight: 'bold' },
  link: { textAlign: 'center', marginTop: '1.5rem', color: '#888', fontSize: '0.9rem' },
};

export default Login;