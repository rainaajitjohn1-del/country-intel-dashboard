import React from 'react';
import { useNavigate } from 'react-router-dom';

function CountryCard({ country }) {
  const navigate = useNavigate();

  return (
    <div
      style={styles.card}
      onClick={() => navigate(`/country/${country.iso_code}`)}
    >
      {country.flag_url && (
        <img src={country.flag_url} alt={country.name} style={styles.flag} />
      )}
      <h3 style={styles.name}>{country.name}</h3>
      <p style={styles.detail}>Region: {country.region}</p>
      <p style={styles.detail}>Capital: {country.capital}</p>
      <p style={styles.detail}>Currency: {country.currency_code}</p>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '1rem',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s',
    textAlign: 'center',
  },
  flag: {
    width: '80px',
    height: '50px',
    objectFit: 'cover',
    borderRadius: '4px',
    marginBottom: '0.5rem',
  },
  name: {
    margin: '0.5rem 0',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  detail: {
    margin: '0.2rem 0',
    fontSize: '0.85rem',
    color: '#666',
  },
};

export default CountryCard;