import axios from 'axios';
import API_URL from '../config';

// ✅ Create Axios instance
const API = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Automatically attach token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle expired or invalid tokens globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.data?.msg === 'Token is not valid')
    ) {
      // Clear local storage and redirect to login
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
