// src/api/axios.js
import axios from "axios";

// Use environment variable for API URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

// ✅ Attach JWT to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("🔐 Sending token:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
