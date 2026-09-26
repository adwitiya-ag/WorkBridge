import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../config/api.config';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
  },
});

// Request interceptor to attach bearer token if available in localStorage
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors cleanly
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let message =
      error.response?.data?.message ||
      error.response?.data?.error;

    if (!message && typeof error.response?.data === 'string') {
      const match = error.response.data.match(/<pre>(.*?)<\/pre>/s) || error.response.data.match(/Error:\s*([^\n<]+)/);
      if (match) {
        message = match[1].trim();
      }
    }

    if (!message) {
      message = error.message || 'An unexpected error occurred';
    }
    
    return Promise.reject({ ...error, customMessage: message });
  }
);

export default axiosClient;
