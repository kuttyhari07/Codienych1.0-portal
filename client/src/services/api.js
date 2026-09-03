import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true,
});

export const apiUrl = (path) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || `${window.location.origin}/api`;
  return new URL(path, `${baseUrl.replace(/\/api\/?$/, '')}/`).toString();
};

export const assetUrl = (url) => (url && url.startsWith('/') ? apiUrl(url) : url);

// Attach Admin JWT Token if present in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
