import axios from 'axios';

const API_BASE = '/api';

export const api = {
  getLocalities: async () => {
    try {
      const response = await axios.get(`${API_BASE}/localities`);
      return response.data.localities;
    } catch (error) {
      console.error("Failed to fetch localities:", error);
      throw error;
    }
  },

  predict: async (data) => {
    try {
      // Parallel requests for comparison
      const [linearRes, polyRes] = await Promise.all([
        axios.post(`${API_BASE}/predict`, { ...data, model_type: 'linear' }),
        axios.post(`${API_BASE}/predict`, { ...data, model_type: 'polynomial' })
      ]);

      return {
        linear: linearRes.data,
        polynomial: polyRes.data
      };
    } catch (error) {
      console.error("Prediction failed:", error);
      throw error;
    }
  }
};
