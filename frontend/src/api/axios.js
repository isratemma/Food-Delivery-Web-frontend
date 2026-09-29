import axios from 'axios';

// In dev: Vite proxy forwards /api → http://localhost:8000
// In prod: set VITE_API_URL to your deployed backend (e.g. https://api.vingolink.com)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  withCredentials: true,
});

export default api;
