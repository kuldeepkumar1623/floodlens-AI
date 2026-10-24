import axios from 'axios';

const API_BASE = '/api'; // Vite proxy will forward to backend
const api = axios.create({ baseURL: API_BASE, timeout: 10000 });

export const fetchLocations = () => api.get('/locations').then((r) => r.data);
export const fetchRainfall = (location, startDate, endDate) =>
  api
    .get('/rainfall', { params: { location, startDate, endDate } })
    .then((r) => r.data);
export const fetchFloodHistory = (location, startDate, endDate) =>
  api
    .get('/flood-history', { params: { location, startDate, endDate } })
    .then((r) => r.data);
export const fetchDataQuality = (location) =>
  api.get('/data-quality', { params: { location } }).then((r) => r.data);
export const fetchRiskAssessment = (location) =>
  api.get('/risk-assessments', { params: { location } }).then((r) => r.data);
export const fetchSummary = (location, startDate, endDate) =>
  api
    .get('/summary', { params: { location, startDate, endDate } })
    .then((r) => r.data);
export const fetchCompare = (locations, startDate, endDate) =>
  api
    .get('/compare', { params: { locations: locations.join(','), startDate, endDate } })
    .then((r) => r.data);
export const fetchHealth = () => api.get('/health').then((r) => r.data);
