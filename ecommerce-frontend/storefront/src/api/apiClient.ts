// src/api/apiClient.ts

import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

import { useAuthStore } from "@/store/auth.store";

/*
|--------------------------------------------------------------------------
| API BASE URL
|--------------------------------------------------------------------------
|
| Prefer NEXT_PUBLIC_API_URL.
| Fallback to the current browser origin so the frontend and API use
| the same host instead of hardcoded localhost.
|
*/

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  `${window.location.protocol}//${window.location.hostname}:8081/api`;

console.log("========================================");
console.log("API BASE URL:", BASE_URL);
console.log("========================================");

function createApiClient(prefix = ""): AxiosInstance {
  return axios.create({
    baseURL: `${BASE_URL}${prefix}`,
    timeout: 30000,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
}

export const apiClient = createApiClient();

export const authApi = createApiClient("/auth");

export const userApi = createApiClient("/users");

function addInterceptor(client: AxiosInstance) {
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = useAuthStore.getState().token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      console.group("🚀 API REQUEST");

      console.log("Method :", config.method?.toUpperCase());

      console.log(
        "URL :",
        `${config.baseURL}${config.url}`
      );

      console.log("Headers :", config.headers);

      console.groupEnd();

      return config;
    }
  );

  client.interceptors.response.use(
    (response) => {
      console.group("✅ API RESPONSE");

      console.log("Status :", response.status);

      console.log("URL :", response.config.url);

      console.groupEnd();

      return response;
    },

    (error: AxiosError) => {
      console.group("❌ API ERROR");

      console.log("Message :", error.message);

      console.log("Code :", error.code);

      console.log("Request :", error.config?.url);

      console.log("Base URL :", error.config?.baseURL);

      console.log("Response :", error.response);

      console.log("Full Error :", error);

      console.groupEnd();

      if (error.response?.status === 401) {
        useAuthStore.getState().logout();
      }

      return Promise.reject(error);
    }
  );
}

addInterceptor(apiClient);
addInterceptor(authApi);
addInterceptor(userApi);
