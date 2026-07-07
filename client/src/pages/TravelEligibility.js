import React, { useState } from 'react';
import { getVisaRequirements } from '../services/api';

function TravelEligibility() {
  const [passport, setPassport] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('visa_free');

  const handleSearch = async () => {
    if (!passport || passport.length !== 2) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getVisaRequirements(passport);
      setData(res.data);
      setActiveTab('visa_free');
    } catch (err) {
      setError('No data found for this passport. Try a valid 2-letter country code like IN, US, GB.');
    }
    setLoading(false);
  };

  const tabs = [
    { key: 'visa_free', label: '🟢 Visa Free', color: '#4caf50' },
    { key: 'visa_on_arrival', label: '🟡 Visa on Arrival', color: '#ff9800' },
    { key: 'e_visa', label: '🔵 e-Visa', color: '#2196f3' },
    { key: 'visa_required', label: '🔴 Visa Required', color: '#f44336' },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>✈️ Travel Eligibility</h1>
        <p style={styles.subtitle}>Enter your passport country to see where you can travel</p>
        <div style={styles.searchRow}>
          <input
            type="text"
            placeholder="Your passport code (e.g. IN, US, GB)"
            value={passport}
            onChange={(e) => setPassport(e.target.value.toUpperCase())}
            style={styles.input}
            maxLength={2}
          />
          <button onClick={handleSearch} style={styles.button} disabled={loading}>
            {loading ? 'Searching...' : 'Check Eligibility'}
          </button>
        </div>
        {error && <p style={styles.error}>{error}</p>}
      </div>

      {data && (
        <div style={styles.content}>
          {/* Summary Cards */}
          <div style={styles.summaryGrid}>
            {tabs.map(tab => (
              <div
                key={tab.key}
                style={{
                  ...styles.summaryCard,
                  borderTop: `4px solid ${tab.color}`,
                  cursor: 'pointer',
                  backgroundColor: activeTab === tab.key ? '#f0f7ff' : 'white',
                }}
                onClick={() => setActiveTab(tab.key)}
              >
                <h2 style={{ color: tab.color, margin: '0 0 0.5rem' }}>
                  {data.summary[tab.key]}
                </h2>
                <p style={styles.summaryLabel}>{tab.label}</p>
              </div>
            ))}
          </div>

          {/* Country List */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>
              {tabs.find(t => t.key === activeTab)?.label} Countries
            </h2>
            <div style={styles.countryGrid}>
              {data.countries[activeTab]?.map((country) => (
                <div key={country.destination_country} style={styles.countryItem}>
                  {country.flag_url && (
                    <img src={country.flag_url} alt="" style={styles.flag} />
                  )}
                  <div>
                    <p style={styles.countryName}>{country.name || country.destination_country}</p>
                    {country.stay_duration && (
                      <p style={styles.stayDuration}>Up to {country.stay_duration} days</p>
                    )}
                    <p style={styles.region}>{country.region}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f0f2f5' },
  hero: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    color: 'white',
    padding: '4rem 2rem',
    textAlign: 'center',
  },
  title: { fontSize: '3rem', margin: '0 0 1rem' },
  subtitle: { fontSize: '1.1rem', opacity: 0.8, marginBottom: '2rem' },
  searchRow: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' },
  input: { padding: '0.75rem 1.5rem', fontSize: '1rem', borderRadius: '8px', border: 'none', outline: 'none', minWidth: '250px' },
  button: { padding: '0.75rem 2rem', backgroundColor: '#e94560', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' },
  error: { color: '#ff6b6b', marginTop: '1rem' },
  content: { padding: '2rem' },
  summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' },
  summaryCard: { backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.2s' },
  summaryLabel: { margin: 0, color: '#555', fontSize: '0.9rem' },
  card: { backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  cardTitle: { fontSize: '1.3rem', color: '#1a1a2e', marginBottom: '1.5rem' },
  countryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' },
  countryItem: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', backgroundColor: '#f8f9fa', borderRadius: '8px' },
  flag: { width: '40px', height: '27px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 },
  countryName: { margin: 0, fontWeight: 'bold', fontSize: '0.9rem' },
  stayDuration: { margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#4caf50', fontWeight: 'bold' },
  region: { margin: '0.2rem 0 0', fontSize: '0.75rem', color: '#888' },
};

export default TravelEligibility;