import axios from 'axios';

const api = axios.create({
  // Uses Vite proxy in dev → no port mismatch ever
  // In production set VITE_API_URL to your deployed backend URL
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
});

export default api;
