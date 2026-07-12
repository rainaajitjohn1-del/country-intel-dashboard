import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: BASE_URL,
});

// Countries
export const searchCountries = (query) => api.get(`/countries/search?q=${query}`);
export const getCountry = (isoCode) => api.get(`/countries/${isoCode}`);
export const getAllCountries = () => api.get('/countries');

// Stats
export const getCountryStats = (isoCode) => api.get(`/stats/${isoCode}`);
export const getLatestStats = (isoCode) => api.get(`/stats/${isoCode}/latest`);

// Exchange rates
export const getExchangeRate = (currencyCode) => api.get(`/exchange/${currencyCode}`);
export const getAllExchangeRates = () => api.get('/exchange');
export const getCurrencyStrength = (homeCurrency, foreignCurrency) => api.get(`/exchange/strength/${homeCurrency}/${foreignCurrency}`);
export const compareExchangeRates = (from, to) => api.get(`/exchange/compare/${from}/${to}`);
export const getCostOfLiving = (homeCountry, foreignCountry) => api.get(`/exchange/col/${homeCountry}/${foreignCountry}`);
export const getVisaRequirements = (passportCode) => api.get(`/countries/visa/${passportCode}`);
export const getSimilarCountries = (isoCode) => api.get(`/countries/${isoCode}/similar`);
export const getBestTimeToVisit = (homeCurrency, foreignCurrency) => api.get(`/exchange/besttime/${homeCurrency}/${foreignCurrency}`);

export const getWatchlist = () => {
  const token = localStorage.getItem('token');
  return api.get('/watchlist', { headers: { Authorization: `Bearer ${token}` } });
};

export const addToWatchlist = (isoCode) => {
  const token = localStorage.getItem('token');
  return api.post(`/watchlist/${isoCode}`, {}, { headers: { Authorization: `Bearer ${token}` } });
};

export const removeFromWatchlist = (isoCode) => {
  const token = localStorage.getItem('token');
  return api.delete(`/watchlist/${isoCode}`, { headers: { Authorization: `Bearer ${token}` } });
};

export const checkWatchlist = (isoCode) => {
  const token = localStorage.getItem('token');
  return api.get(`/watchlist/check/${isoCode}`, { headers: { Authorization: `Bearer ${token}` } });
};