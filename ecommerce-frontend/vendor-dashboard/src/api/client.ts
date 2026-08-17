import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8081/api",
  timeout: 15000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem(
        "vendorToken"
      );

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  }
);

apiClient.interceptors.response.use(
  (response) => response,

  (error) => {
    if (
      error.response?.status === 401
    ) {
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

export default apiClient;
