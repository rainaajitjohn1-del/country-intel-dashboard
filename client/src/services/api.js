import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api';

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
export const compareExchangeRates = (from, to) => api.get(`/exchange/compare/${from}/${to}`);