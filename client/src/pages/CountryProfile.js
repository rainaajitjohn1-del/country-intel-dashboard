import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCountry, getLatestStats, getExchangeRate, getCountryStats, getCurrencyStrength } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function CountryProfile() {
  const { iso_code } = useParams();
  const [country, setCountry] = useState(null);
  const [stats, setStats] = useState(null);
  const [historicalStats, setHistoricalStats] = useState([]);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [homeCurrency, setHomeCurrency] = useState('');
  const [currencyStrength, setCurrencyStrength] = useState(null);
  const [strengthLoading, setStrengthLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const countryRes = await getCountry(iso_code);
        setCountry(countryRes.data);

        try {
          const statsRes = await getLatestStats(iso_code);
          setStats(statsRes.data);
        } catch (err) {
          console.log('No stats available');
        }

        try {
          const histRes = await getCountryStats(iso_code);
          setHistoricalStats(histRes.data.reverse());
        } catch (err) {
          console.log('No historical stats available');
        }

        try {
          if (countryRes.data.currency_code) {
            const exRes = await getExchangeRate(countryRes.data.currency_code);
            setExchangeRate(exRes.data);
          }
        } catch (err) {
          console.log('No exchange rate available');
        }

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [iso_code]);

  const handleCurrencyCheck = async () => {
    if (!homeCurrency || !country?.currency_code) return;
    setStrengthLoading(true);
    try {
      const res = await getCurrencyStrength(homeCurrency, country.currency_code);
      setCurrencyStrength(res.data);
    } catch (err) {
      setCurrencyStrength({ error: 'Currency not found. Try a valid code like USD, INR, EUR.' });
    }
    setStrengthLoading(false);
  };

  if (loading) return <p style={{ padding: '2rem' }}>Loading...</p>;
  if (!country) return <p style={{ padding: '2rem' }}>Country not found.</p>;

  return (
    <div style={styles.container}>
      {/* Header */}
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

      {/* Currency Strength Comparator */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>💱 Currency Strength Comparator</h2>
        <p style={styles.cardSubtitle}>Enter your home currency to see how strong it is in {country.name}</p>
        <div style={styles.inputRow}>
          <input
            type="text"
            placeholder="Your currency code (e.g. INR, USD, EUR)"
            value={homeCurrency}
            onChange={(e) => setHomeCurrency(e.target.value.toUpperCase())}
            style={styles.input}
            maxLength={3}
          />
          <button
            onClick={handleCurrencyCheck}
            style={styles.button}
            disabled={strengthLoading}
          >
            {strengthLoading ? 'Checking...' : 'Check Strength'}
          </button>
        </div>

        {currencyStrength && (
          <div style={{
            ...styles.strengthResult,
            backgroundColor: currencyStrength.verdict === 'strong' ? '#e8f5e9' : '#fce4ec',
            borderLeft: `4px solid ${currencyStrength.verdict === 'strong' ? '#4caf50' : '#e91e63'}`,
          }}>
            {currencyStrength.error ? (
              <p style={{ color: '#e91e63' }}>{currencyStrength.error}</p>
            ) : (
              <>
                <p style={styles.strengthMessage}>{currencyStrength.message}</p>
                <p style={styles.strengthVerdict}>
                  {currencyStrength.verdict === 'strong'
                    ? '✅ Your money goes further here'
                    : '⚠️ This destination is expensive for your currency'}
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Stats Grid */}
      {stats ? (
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
      ) : (
        <div style={styles.noStats}>
          <p>No statistical data available for this country yet.</p>
        </div>
      )}

      {/* GDP Chart */}
      {historicalStats.length > 0 && (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>📈 GDP Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={historicalStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(v) => `$${(v / 1e9).toFixed(0)}B`} />
              <Tooltip formatter={(v) => `$${(parseFloat(v) / 1e9).toFixed(2)}B`} />
              <Line type="monotone" dataKey="gdp" stroke="#1a1a2e" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '2rem', backgroundColor: '#f0f2f5', minHeight: '100vh' },
  header: { display: 'flex', alignItems: 'center', gap: '2rem', backgroundColor: 'white', padding: '2rem', borderRadius: '12px', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  flag: { width: '120px', height: '80px', objectFit: 'cover', borderRadius: '8px' },
  name: { fontSize: '2rem', margin: '0 0 0.5rem' },
  meta: { margin: '0.3rem 0', color: '#555' },
  card: { backgroundColor: 'white', padding: '2rem', borderRadius: '12px', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  cardTitle: { fontSize: '1.2rem', margin: '0 0 0.5rem', color: '#1a1a2e' },
  cardSubtitle: { color: '#888', fontSize: '0.9rem', marginBottom: '1.5rem' },
  inputRow: { display: 'flex', gap: '1rem', flexWrap: 'wrap' },
  input: { flex: 1, padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', outline: 'none', minWidth: '200px' },
  button: { padding: '0.75rem 1.5rem', backgroundColor: '#1a1a2e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem' },
  strengthResult: { marginTop: '1.5rem', padding: '1.5rem', borderRadius: '8px' },
  strengthMessage: { margin: '0 0 0.5rem', fontWeight: 'bold', fontSize: '1.1rem' },
  strengthVerdict: { margin: 0, color: '#555' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem' },
  statCard: { backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  noStats: { backgroundColor: 'white', padding: '2rem', borderRadius: '12px', textAlign: 'center', color: '#888', marginBottom: '1.5rem' },
};

export default CountryProfile;