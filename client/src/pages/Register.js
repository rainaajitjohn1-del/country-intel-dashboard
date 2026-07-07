import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    home_country: '',
    home_currency: '',
    passport_country: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🌍 Join NationIQ</h1>
        <p style={styles.subtitle}>Create your account to get personalized insights</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Full Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} style={styles.input} placeholder="Your name" required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} style={styles.input} placeholder="your@email.com" required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} style={styles.input} placeholder="••••••••" required />
          </div>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Home Country Code</label>
              <input type="text" name="home_country" value={form.home_country} onChange={handleChange} style={styles.input} placeholder="e.g. IN" maxLength={2} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Home Currency</label>
              <input type="text" name="home_currency" value={form.home_currency} onChange={handleChange} style={styles.input} placeholder="e.g. INR" maxLength={3} />
            </div>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Passport Country Code</label>
            <input type="text" name="passport_country" value={form.passport_country} onChange={handleChange} style={styles.input} placeholder="e.g. IN" maxLength={2} />
          </div>
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={styles.link}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' },
  card: { backgroundColor: 'white', padding: '3rem', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', width: '100%', maxWidth: '480px' },
  title: { fontSize: '2rem', margin: '0 0 0.5rem', color: '#1a1a2e', textAlign: 'center' },
  subtitle: { color: '#888', textAlign: 'center', marginBottom: '2rem' },
  error: { backgroundColor: '#fce4ec', color: '#e91e63', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  field: { marginBottom: '1.5rem' },
  label: { display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333', fontSize: '0.9rem' },
  input: { width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' },
  button: { width: '100%', padding: '0.875rem', backgroundColor: '#1a1a2e', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer', fontWeight: 'bold' },
  link: { textAlign: 'center', marginTop: '1.5rem', color: '#888', fontSize: '0.9rem' },
};

export default Register;