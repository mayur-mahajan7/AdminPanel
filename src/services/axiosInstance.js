// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Get base URL from .env
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        return api
          .post('/auth/refresh-token', { refreshToken })
          .then((response) => {
            const { accessToken, refreshToken: newRefreshToken } = response.data;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', newRefreshToken);

            // Retry the original request with new tokens
            error.config.headers['Authorization'] = `Bearer ${accessToken}`;
            return api(error.config);
          })
          .catch(() => {
            // Redirect to login if refresh fails
            window.location.href = '/login';
          });
      }
    }
    return Promise.reject(error);
  }
);

export default api;
