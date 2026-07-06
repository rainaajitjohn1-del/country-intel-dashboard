import React, { useState } from 'react';
import { searchCountries, getLatestStats } from '../services/api';

function Compare() {
  const [queries, setQueries] = useState(['', '']);
  const [results, setResults] = useState([null, null]);
  const [selected, setSelected] = useState([null, null]);
  const [stats, setStats] = useState([null, null]);

  const handleSearch = async (value, index) => {
    const newQueries = [...queries];
    newQueries[index] = value;
    setQueries(newQueries);

    if (value.length > 1) {
      const res = await searchCountries(value);
      const newResults = [...results];
      newResults[index] = res.data.slice(0, 5);
      setResults(newResults);
    }
  };

  const handleSelect = async (country, index) => {
    const newSelected = [...selected];
    newSelected[index] = country;
    setSelected(newSelected);

    const newQueries = [...queries];
    newQueries[index] = country.name;
    setQueries(newQueries);

    const newResults = [...results];
    newResults[index] = [];
    setResults(newResults);

    const statsRes = await getLatestStats(country.iso_code);
    const newStats = [...stats];
    newStats[index] = statsRes.data;
    setStats(newStats);
  };

  const formatValue = (key, value) => {
    if (!value) return 'N/A';
    if (key === 'gdp') {
      const num = parseFloat(value);
      if (num >= 1e12) return '$' + (num / 1e12).toFixed(2) + 'T';
      if (num >= 1e9) return '$' + (num / 1e9).toFixed(2) + 'B';
      return '$' + num.toLocaleString();
    }
    if (key === 'population') {
      const num = parseFloat(value);
      if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
      if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
      return num.toLocaleString();
    }
    return Number(value).toFixed(2);
  };

  const getWinner = (key, val1, val2) => {
    if (!val1 || !val2) return null;
    const higherIsBetter = ['gdp', 'population', 'gdp_growth_rate', 'life_expectancy'];
    const lowerIsBetter = ['unemployment_rate', 'inflation_rate', 'birth_rate'];
    const v1 = parseFloat(val1);
    const v2 = parseFloat(val2);
    if (higherIsBetter.includes(key)) return v1 > v2 ? 0 : 1;
    if (lowerIsBetter.includes(key)) return v1 < v2 ? 0 : 1;
    return null;
  };

  const statLabels = {
    gdp: 'GDP',
    population: 'Population',
    gdp_growth_rate: 'GDP Growth (%)',
    birth_rate: 'Birth Rate',
    life_expectancy: 'Life Expectancy',
    unemployment_rate: 'Unemployment (%)',
    inflation_rate: 'Inflation (%)',
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Compare Countries</h1>
      <p style={styles.subtitle}>Select two countries to compare their key statistics side by side</p>

      <div style={styles.searchRow}>
        {[0, 1].map((index) => (
          <div key={index} style={styles.searchBox}>
            <input
              type="text"
              placeholder={`Search country ${index + 1}...`}
              value={queries[index]}
              onChange={(e) => handleSearch(e.target.value, index)}
              style={styles.input}
            />
            {results[index] && results[index].length > 0 && (
              <ul style={styles.dropdown}>
                {results[index].map((c) => (
                  <li key={c.iso_code} onClick={() => handleSelect(c, index)} style={styles.item}>
                    {c.flag_url && <img src={c.flag_url} alt="" style={styles.flagSmall} />}
                    {c.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {selected[0] && selected[1] && (
        <div style={styles.table}>
          <div style={styles.tableHeader}>
            <div style={styles.labelCol}>Stat</div>
            <div style={styles.valueCol}>
              {selected[0].flag_url && <img src={selected[0].flag_url} alt="" style={styles.flagSmall} />}
              {selected[0].name}
            </div>
            <div style={styles.valueCol}>
              {selected[1].flag_url && <img src={selected[1].flag_url} alt="" style={styles.flagSmall} />}
              {selected[1].name}
            </div>
          </div>
          {Object.entries(statLabels).map(([key, label]) => {
            const winner = getWinner(key, stats[0]?.[key], stats[1]?.[key]);
            return (
              <div key={key} style={styles.tableRow}>
                <div style={styles.labelCol}>{label}</div>
                <div style={{
                  ...styles.valueCol,
                  backgroundColor: winner === 0 ? '#e8f5e9' : 'transparent',
                  borderRadius: '8px',
                  fontWeight: winner === 0 ? 'bold' : 'normal',
                }}>
                  {formatValue(key, stats[0]?.[key])}
                </div>
                <div style={{
                  ...styles.valueCol,
                  backgroundColor: winner === 1 ? '#e8f5e9' : 'transparent',
                  borderRadius: '8px',
                  fontWeight: winner === 1 ? 'bold' : 'normal',
                }}>
                  {formatValue(key, stats[1]?.[key])}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!selected[0] || !selected[1] ? (
        <div style={styles.placeholder}>
          <p>🌍 Search and select two countries above to compare them</p>
        </div>
      ) : null}
    </div>
  );
}

const styles = {
  container: { padding: '2rem', backgroundColor: '#f0f2f5', minHeight: '100vh' },
  title: { fontSize: '2rem', color: '#1a1a2e', marginBottom: '0.5rem' },
  subtitle: { color: '#888', marginBottom: '2rem' },
  searchRow: { display: 'flex', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap' },
  searchBox: { flex: 1, position: 'relative', minWidth: '250px' },
  input: { width: '100%', padding: '0.75rem', fontSize: '1rem', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box', outline: 'none' },
  dropdown: { position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px', listStyle: 'none', padding: 0, margin: 0, zIndex: 100, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
  item: { padding: '0.75rem', cursor: 'pointer', borderBottom: '1px solid #eee', color: '#000', display: 'flex', alignItems: 'center', gap: '0.5rem' },
  flagSmall: { width: '24px', height: '16px', objectFit: 'cover', borderRadius: '2px' },
  table: { backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  tableHeader: { display: 'flex', backgroundColor: '#1a1a2e', color: 'white', padding: '1rem 1.5rem', alignItems: 'center', gap: '0.5rem' },
  tableRow: { display: 'flex', padding: '1rem 1.5rem', borderBottom: '1px solid #eee', alignItems: 'center' },
  labelCol: { flex: 1, fontWeight: 'bold', color: '#333' },
  valueCol: { flex: 1, textAlign: 'center', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' },
  placeholder: { textAlign: 'center', padding: '4rem', color: '#888', backgroundColor: 'white', borderRadius: '12px', fontSize: '1.1rem' },
};

export default Compare;