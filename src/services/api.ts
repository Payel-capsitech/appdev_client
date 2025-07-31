import axios from 'axios';

const API = axios.create({
  baseURL: 'https://localhost:7238/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;