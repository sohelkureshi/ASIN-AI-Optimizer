const api = {
  // Optimize product listing by ASIN
  optimizeProduct: async (asin, marketplace = 'auto') => {
    return await apiClient.post('/products/optimize', { 
      asin, 
      marketplace: marketplace === 'auto' ? null : marketplace 
    });
  },

  // Rest of the code remains the same...
  getHistory: async (asin) => {
    return await apiClient.get(`/products/history/${asin}`);
  },

};

export default api;
