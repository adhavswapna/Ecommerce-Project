import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:8081/api",

  headers: {
    "Content-Type": "application/json",
  },

  timeout: 15000,
});

API.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("vendorToken");

    if (token) {
      config.headers =
        config.headers || {};

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(
        "vendorToken"
      );

      localStorage.removeItem(
        "vendorUser"
      );

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default API;
