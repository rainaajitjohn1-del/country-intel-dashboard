import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getWatchlist, removeFromWatchlist } from '../services/api';
import { useAuth } from '../context/AuthContext';

function Watchlist() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchWatchlist();
  }, [user, navigate]);

  const fetchWatchlist = async () => {
    try {
      const res = await getWatchlist();
      setCountries(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleRemove = async (isoCode) => {
    try {
      await removeFromWatchlist(isoCode);
      setCountries(countries.filter(c => c.iso_code !== isoCode));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p style={{ padding: '2rem' }}>Loading...</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>⭐ My Watchlist</h1>
      <p style={styles.subtitle}>Countries you're keeping an eye on</p>

      {countries.length === 0 ? (
        <div style={styles.empty}>
          <p>Your watchlist is empty.</p>
          <p>Visit any country profile and click "Add to Watchlist" to get started.</p>
          <button onClick={() => navigate('/')} style={styles.button}>
            Explore Countries
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {countries.map((country) => (
            <div key={country.iso_code} style={styles.card}>
              {country.flag_url && (
                <img src={country.flag_url} alt={country.name} style={styles.flag} />
              )}
              <div style={styles.info}>
                <h3 style={styles.name}>{country.name}</h3>
                <p style={styles.detail}>{country.region}</p>
                <p style={styles.detail}>Capital: {country.capital}</p>
                <p style={styles.detail}>Currency: {country.currency_code}</p>
              </div>
              <div style={styles.actions}>
                <button
                  onClick={() => navigate(`/country/${country.iso_code}`)}
                  style={styles.viewBtn}
                >
                  View
                </button>
                <button
                  onClick={() => handleRemove(country.iso_code)}
                  style={styles.removeBtn}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '2rem', backgroundColor: '#f0f2f5', minHeight: '100vh' },
  title: { fontSize: '2rem', color: '#1a1a2e', marginBottom: '0.5rem' },
  subtitle: { color: '#888', marginBottom: '2rem' },
  empty: { backgroundColor: 'white', padding: '4rem', borderRadius: '12px', textAlign: 'center', color: '#888', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  button: { marginTop: '1rem', padding: '0.75rem 2rem', backgroundColor: '#1a1a2e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem' },
  grid: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  card: { backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  flag: { width: '80px', height: '53px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 },
  info: { flex: 1 },
  name: { margin: '0 0 0.3rem', fontSize: '1.1rem', color: '#1a1a2e' },
  detail: { margin: '0.2rem 0', color: '#666', fontSize: '0.9rem' },
  actions: { display: 'flex', gap: '0.5rem' },
  viewBtn: { padding: '0.5rem 1rem', backgroundColor: '#1a1a2e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  removeBtn: { padding: '0.5rem 1rem', backgroundColor: 'white', color: '#e91e63', border: '1px solid #e91e63', borderRadius: '6px', cursor: 'pointer' },
};

export default Watchlist;