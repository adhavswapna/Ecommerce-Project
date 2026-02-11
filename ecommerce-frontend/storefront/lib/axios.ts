import axios from "axios";

export const api = axios.create({
  timeout: 10000,
  withCredentials: true
});

// Attach JWT automatically
api.interceptors.request.use(config => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

