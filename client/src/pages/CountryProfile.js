import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCountry, getLatestStats, getExchangeRate, getCountryStats } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function CountryProfile() {
  const { iso_code } = useParams();
  const [country, setCountry] = useState(null);
  const [stats, setStats] = useState(null);
  const [historicalStats, setHistoricalStats] = useState([]);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [countryRes, statsRes, histRes] = await Promise.all([
          getCountry(iso_code),
          getLatestStats(iso_code),
          getCountryStats(iso_code),
        ]);
        setCountry(countryRes.data);
        setStats(statsRes.data);
        setHistoricalStats(histRes.data.reverse());

        if (countryRes.data.currency_code) {
          const exRes = await getExchangeRate(countryRes.data.currency_code);
          setExchangeRate(exRes.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [iso_code]);

  if (loading) return <p style={{ padding: '2rem' }}>Loading...</p>;
  if (!country) return <p style={{ padding: '2rem' }}>Country not found.</p>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        {country.flag_url && <img src={country.flag_url} alt={country.name} style={styles.flag} />}
        <div>
          <h1 style={styles.name}>{country.name}</h1>
          <p style={styles.meta}>{country.region} • Capital: {country.capital}</p>
          <p style={styles.meta}>Currency: {country.currency_name} ({country.currency_code})</p>
          {exchangeRate && (
            <p style={styles.meta}>1 USD = {parseFloat(exchangeRate.rate_to_usd).toFixed(2)} {country.currency_code}</p>
          )}
        </div>
      </div>

      {stats && (
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <h3>GDP</h3>
            <p>{stats.gdp ? '$' + (parseFloat(stats.gdp) / 1e9).toFixed(2) + 'B' : 'N/A'}</p>
          </div>
          <div style={styles.statCard}>
            <h3>Population</h3>
            <p>{stats.population ? (parseFloat(stats.population) / 1e6).toFixed(2) + 'M' : 'N/A'}</p>
          </div>
          <div style={styles.statCard}>
            <h3>GDP Growth</h3>
            <p>{stats.gdp_growth_rate ? parseFloat(stats.gdp_growth_rate).toFixed(2) + '%' : 'N/A'}</p>
          </div>
          <div style={styles.statCard}>
            <h3>Birth Rate</h3>
            <p>{stats.birth_rate ? parseFloat(stats.birth_rate).toFixed(2) : 'N/A'}</p>
          </div>
          <div style={styles.statCard}>
            <h3>Life Expectancy</h3>
            <p>{stats.life_expectancy ? parseFloat(stats.life_expectancy).toFixed(1) + ' yrs' : 'N/A'}</p>
          </div>
          <div style={styles.statCard}>
            <h3>Unemployment</h3>
            <p>{stats.unemployment_rate ? parseFloat(stats.unemployment_rate).toFixed(2) + '%' : 'N/A'}</p>
          </div>
        </div>
      )}

      {historicalStats.length > 0 && (
        <div style={styles.chartSection}>
          <h2>GDP Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={historicalStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(v) => `$${(v / 1e9).toFixed(0)}B`} />
              <Tooltip formatter={(v) => `$${(parseFloat(v) / 1e9).toFixed(2)}B`} />
              <Line type="monotone" dataKey="gdp" stroke="#1a1a2e" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '2rem', backgroundColor: '#f0f2f5', minHeight: '100vh' },
  header: { display: 'flex', alignItems: 'center', gap: '2rem', backgroundColor: 'white', padding: '2rem', borderRadius: '12px', marginBottom: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  flag: { width: '120px', height: '80px', objectFit: 'cover', borderRadius: '8px' },
  name: { fontSize: '2rem', margin: '0 0 0.5rem' },
  meta: { margin: '0.3rem 0', color: '#555' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' },
  statCard: { backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  chartSection: { backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
};

export default CountryProfile;