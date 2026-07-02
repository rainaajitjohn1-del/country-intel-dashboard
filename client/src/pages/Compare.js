import React, { useState } from 'react';
import { searchCountries, getLatestStats, getCountry } from '../services/api';

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

  const statLabels = {
    gdp: 'GDP (USD)',
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
            <div style={styles.valueCol}>{selected[0].name}</div>
            <div style={styles.valueCol}>{selected[1].name}</div>
          </div>
          {Object.entries(statLabels).map(([key, label]) => (
            <div key={key} style={styles.tableRow}>
              <div style={styles.labelCol}>{label}</div>
              <div style={styles.valueCol}>
                {stats[0]?.[key] ? Number(stats[0][key]).toLocaleString() : 'N/A'}
              </div>
              <div style={styles.valueCol}>
                {stats[1]?.[key] ? Number(stats[1][key]).toLocaleString() : 'N/A'}
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
  title: { fontSize: '2rem', color: '#1a1a2e', marginBottom: '2rem' },
  searchRow: { display: 'flex', gap: '2rem', marginBottom: '2rem' },
  searchBox: { flex: 1, position: 'relative' },
  input: { width: '100%', padding: '0.75rem', fontSize: '1rem', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' },
  dropdown: { position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '8px', listStyle: 'none', padding: 0, margin: 0, zIndex: 100 },
  item: { padding: '0.75rem', cursor: 'pointer', borderBottom: '1px solid #eee' },
  table: { backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  tableHeader: { display: 'flex', backgroundColor: '#1a1a2e', color: 'white', padding: '1rem' },
  tableRow: { display: 'flex', padding: '1rem', borderBottom: '1px solid #eee' },
  labelCol: { flex: 1, fontWeight: 'bold' },
  valueCol: { flex: 1, textAlign: 'center' },
};

export default Compare;