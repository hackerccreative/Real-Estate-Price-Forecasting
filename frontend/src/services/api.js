import axios from "axios";

// Backend base URL from Vercel environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // handles Render cold start
});

export const api = {
  // Fetch localities
  getLocalities: async () => {
    try {
      const response = await apiClient.get("/api/localities");
      return response.data; // backend returns array directly
    } catch (error) {
      console.error("Failed to fetch localities:", error);
      throw error;
    }
  },

  // Predict prices (linear + polynomial)
  predict: async (data) => {
    try {
      const [linearRes, polyRes] = await Promise.all([
        apiClient.post("/api/predict", {
          ...data,
          model_type: "linear",
        }),
        apiClient.post("/api/predict", {
          ...data,
          model_type: "polynomial",
        }),
      ]);

      return {
        linear: linearRes.data,
        polynomial: polyRes.data,
      };
    } catch (error) {
      console.error("Prediction failed:", error);
      throw error;
    }
  },
};

export default api;
