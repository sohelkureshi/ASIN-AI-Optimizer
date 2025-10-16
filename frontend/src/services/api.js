import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds timeout for scraping and AI processing
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

const api = {
  // Optimize product listing by ASIN
  optimizeProduct: async (asin) => {
    return await apiClient.post('/products/optimize', { asin });
  },

  // Get optimization history for specific ASIN
  getHistory: async (asin) => {
    return await apiClient.get(`/products/history/${asin}`);
  },

};

export default api;
