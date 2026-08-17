import axios from "axios";

export const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:8081/api",

  headers: {
    "Content-Type": "application/json",
  },
});

/*
 * Automatically attach vendor JWT
 * to every API request.
 */
API.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("vendorToken");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/*
 * Handle unauthorized responses.
 */
API.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(
        "vendorToken"
      );

      localStorage.removeItem(
        "vendorUser"
      );

      window.location.href =
        "/login";
    }

    return Promise.reject(error);
  }
);

export default API;
