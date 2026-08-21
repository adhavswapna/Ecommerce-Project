// src/api/apiClient.ts

import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

import { useAuthStore } from "@/store/auth.store";

/* ============================================================================
 * API BASE URL
 * ============================================================================
 * Uses NEXT_PUBLIC_API_URL if available.
 * Otherwise falls back to the current host through the API Gateway.
 * ========================================================================== */

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  (typeof window !== "undefined"
    ? `${window.location.protocol}//${window.location.hostname}:8081/api`
    : "http://localhost:8081/api");

console.log("========================================");
console.log("API BASE URL:", BASE_URL);
console.log("========================================");

/* ============================================================================
 * Factory
 * ========================================================================== */

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

/* ============================================================================
 * Generic Client
 * ========================================================================== */

export const apiClient = createApiClient();

/* ============================================================================
 * Service Clients
 * ========================================================================== */

export const authApi = createApiClient("/auth");
export const userApi = createApiClient("/users");
export const productApi = createApiClient("/products");
export const cartApi = createApiClient("/cart");
export const orderApi = createApiClient("/orders");
export const paymentApi = createApiClient("/payments");
export const ratingApi = createApiClient("/ratings");
export const inventoryApi = createApiClient("/inventory");
export const invoiceApi = createApiClient("/invoices");
export const shippingApi = createApiClient("/shipping");
export const emailApi = createApiClient("/email");
export const searchApi = createApiClient("/search");
export const analyticsApi = createApiClient("/analytics");
export const vendorApi = createApiClient("/vendors");
export const adminApi = createApiClient("/admin");
export const refundApi = createApiClient("/refunds");
export const notificationApi = createApiClient("/notifications");

/* ============================================================================
 * Interceptors
 * ========================================================================== */

function addInterceptor(client: AxiosInstance) {
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = useAuthStore.getState().token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      console.group("🚀 API REQUEST");
      console.log("Method :", config.method?.toUpperCase());
      console.log("URL :", `${config.baseURL}${config.url}`);
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

/* ============================================================================
 * Register interceptors
 * ========================================================================== */

[
  apiClient,
  authApi,
  userApi,
  productApi,
  cartApi,
  orderApi,
  paymentApi,
  ratingApi,
  inventoryApi,
  invoiceApi,
  shippingApi,
  emailApi,
  searchApi,
  analyticsApi,
  vendorApi,
  adminApi,
  refundApi,
  notificationApi,
].forEach(addInterceptor);
