import axios from 'axios';
const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});


api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('snipify_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return config;
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn('Unauthorized - redirecting or clearing session');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('snipify_token');
        window.location.href = '/auth/sign_in';
      }
    }
    return Promise.reject(error);
  },
);

export default api;
