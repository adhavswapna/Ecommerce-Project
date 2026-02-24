// lib/axios.ts
import axios from "axios";

// Create reusable axios instance
export const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // change to true later if using cookies
});

// ==============================
// REQUEST INTERCEPTOR
// ==============================
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ==============================
// RESPONSE INTERCEPTOR
// ==============================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optional: Auto logout on 401
    if (error.response?.status === 401) {
      console.warn("Unauthorized. Token may be invalid.");

      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        // Optional: redirect to login
        // window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
