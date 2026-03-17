import axios from "axios";

// ❌ Remove single baseURL dependency
export const api = axios.create({
  withCredentials: true,
});

// ✅ Attach token automatically (Next.js safe)
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});
