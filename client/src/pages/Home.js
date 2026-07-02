import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import CountryCard from '../components/CountryCard';
import { getAllCountries } from '../services/api';

function Home() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllCountries()
      .then((res) => {
        setCountries(res.data.slice(0, 12));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>🌍 NationIQ</h1>
        <p style={styles.subtitle}>
          Your one-stop dashboard for country intelligence — GDP, currency, population, travel insights and more.
        </p>
        <SearchBar />
      </div>
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Explore Countries</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div style={styles.grid}>
            {countries.map((country) => (
              <CountryCard key={country.iso_code} country={country} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
  },
  hero: {
    backgroundColor: '#1a1a2e',
    color: 'white',
    padding: '4rem 2rem',
    textAlign: 'center',
  },
  title: {
    fontSize: '3rem',
    margin: '0 0 1rem',
  },
  subtitle: {
    fontSize: '1.1rem',
    marginBottom: '2rem',
    opacity: 0.8,
  },
  section: {
    padding: '2rem',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    marginBottom: '1.5rem',
    color: '#1a1a2e',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '1.5rem',
  },
};

export default Home;