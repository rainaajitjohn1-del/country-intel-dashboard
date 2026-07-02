import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchCountries } from '../services/api';

function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length > 1) {
      try {
        const res = await searchCountries(value);
        setResults(res.data.slice(0, 5));
      } catch (err) {
        console.error(err);
      }
    } else {
      setResults([]);
    }
  };

  const handleSelect = (isoCode) => {
    setQuery('');
    setResults([]);
    navigate(`/country/${isoCode}`);
  };

  return (
    <div style={styles.container}>
      <input
        type="text"
        placeholder="Search for a country..."
        value={query}
        onChange={handleSearch}
        style={styles.input}
      />
      {results.length > 0 && (
        <ul style={styles.dropdown}>
          {results.map((country) => (
            <li
              key={country.iso_code}
              onClick={() => handleSelect(country.iso_code)}
              style={styles.item}
            >
              {country.name} ({country.iso_code})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    width: '100%',
    maxWidth: '500px',
    margin: '0 auto',
  },
  input: {
    width: '100%',
    padding: '1rem',
    fontSize: '1rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    outline: 'none',
    boxSizing: 'border-box',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    border: '1px solid #ccc',
    borderRadius: '8px',
    listStyle: 'none',
    padding: 0,
    margin: 0,
    zIndex: 1000,
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    color: '#000000',
  },
  item: {
    padding: '0.75rem 1rem',
    cursor: 'pointer',
    borderBottom: '1px solid #eee',
    color: '#000000',
    backgroundColor: 'white',
    fontSize: '1rem',
  },
};

export default SearchBar;