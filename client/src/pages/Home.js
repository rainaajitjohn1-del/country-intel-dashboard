import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import CountryCard from '../components/CountryCard';
import Spinner from '../components/Spinner';
import { getAllCountries } from '../services/api';
import axios from 'axios';

function Home() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [platformStats, setPlatformStats] = useState(null);

  const regions = ['All', 'Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  useEffect(() => {
    getAllCountries()
      .then((res) => {
        setCountries(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });

    axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}/countries/meta/stats`)
      .then(res => setPlatformStats(res.data))
      .catch(err => console.error(err));
  }, []);

  const filtered = filter === 'All'
    ? countries
    : countries.filter(c => c.region && c.region.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>🌍 NationIQ</h1>
        <p style={styles.subtitle}>
          Your one-stop dashboard for country intelligence — GDP, currency, population, travel insights and more.
        </p>
        <SearchBar />
        <div style={styles.stats}>
          <div style={styles.statPill}>
            🌐 {platformStats ? platformStats.countries.toLocaleString() : '...'} Countries
          </div>
          <div style={styles.statPill}>
            💱 {platformStats ? platformStats.currencies.toLocaleString() : '...'} Currencies
          </div>
          <div style={styles.statPill}>
            📊 {platformStats ? platformStats.dataPoints.toLocaleString() : '...'} Data Points
          </div>
          <div style={styles.statPill}>
            ✈️ {platformStats ? platformStats.visaRecords.toLocaleString() : '...'} Visa Records
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Explore Countries</h2>
          <div style={styles.filters}>
            {regions.map(region => (
              <button
                key={region}
                onClick={() => setFilter(region)}
                style={{
                  ...styles.filterBtn,
                  ...(filter === region ? styles.filterBtnActive : {})
                }}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <Spinner message="Loading countries..." />
        ) : (
          <>
            <p style={styles.count}>{filtered.length} countries</p>
            <div style={styles.grid}>
              {filtered.map((country) => (
                <CountryCard key={country.iso_code} country={country} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f0f2f5' },
  hero: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    color: 'white',
    padding: '5rem 2rem 4rem',
    textAlign: 'center',
  },
  title: { fontSize: '3.5rem', margin: '0 0 1rem', letterSpacing: '-1px' },
  subtitle: { fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.8, maxWidth: '600px', margin: '0 auto 2rem' },
  stats: { display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' },
  statPill: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '50px',
    padding: '0.5rem 1.2rem',
    fontSize: '0.9rem',
  },
  section: { padding: '2rem' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' },
  sectionTitle: { fontSize: '1.5rem', color: '#1a1a2e', margin: 0 },
  filters: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' },
  filterBtn: {
    padding: '0.4rem 1rem',
    borderRadius: '50px',
    border: '1px solid #ddd',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '0.85rem',
    color: '#555',
  },
  filterBtnActive: {
    backgroundColor: '#1a1a2e',
    color: 'white',
    border: '1px solid #1a1a2e',
  },
  count: { color: '#888', fontSize: '0.9rem', marginBottom: '1rem' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '1.5rem',
  },
};

export default Home;