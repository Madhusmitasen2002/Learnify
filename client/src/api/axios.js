// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
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
