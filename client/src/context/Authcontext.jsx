// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    // ✅ Set token on axios (important after page reload)
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    api
      .get("/auth/profile")
      .then((res) => {
        setUser(res.data.user);
      })
      .catch((err) => {
        console.warn("❌ Profile fetch failed", err);
        localStorage.removeItem("token");
      })
      .finally(() => setLoading(false));
  }, []);

  const login = (token, userData) => {
    // ✅ Save token for future requests
    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
