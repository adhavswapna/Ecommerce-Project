import axios from "axios";

const axiosInstance = axios.create({
  // ❌ removed baseURL (we will pass service URLs dynamically)
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  // ✅ Fix for Next.js (avoid server-side crash)
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default axiosInstance;
