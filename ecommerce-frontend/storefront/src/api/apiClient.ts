// src/api/apiClient.ts

import axios, { AxiosInstance } from "axios";

/**
 * 🔐 Attach JWT token + global error handling
 */
const attachToken = (instance: AxiosInstance): AxiosInstance => {
  // ✅ REQUEST INTERCEPTOR
  instance.interceptors.request.use(
    (config) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");

        if (token) {
          // ✅ Ensure headers exist
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // ✅ RESPONSE INTERCEPTOR
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      // 🔴 Auto logout on 401 (token expired/invalid)
      if (error.response?.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

/**
 * 🏗️ Helper to create service clients
 */
const createApi = (baseURL?: string): AxiosInstance => {
  return attachToken(
    axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    })
  );
};

// ================= SERVICES =================

// 🔑 AUTH SERVICE (3001)
export const authApi = createApi(
  process.env.NEXT_PUBLIC_AUTH_API_URL || "http://localhost:3001"
);

// 👤 USER SERVICE (3015)
export const userApi = createApi(
  process.env.NEXT_PUBLIC_USER_API_URL || "http://localhost:3015"
);

// 🛍️ PRODUCT SERVICE (3003)
export const productApi = createApi(
  process.env.NEXT_PUBLIC_PRODUCT_API_URL || "http://localhost:3003"
);

// 🛒 CART SERVICE (3005)
export const cartApi = createApi(
  process.env.NEXT_PUBLIC_CART_API_URL || "http://localhost:3005"
);

// 📦 ORDER SERVICE (3006)
export const orderApi = createApi(
  process.env.NEXT_PUBLIC_ORDER_API_URL || "http://localhost:3006"
);

// 💳 PAYMENT SERVICE (3007)
export const paymentApi = createApi(
  process.env.NEXT_PUBLIC_PAYMENT_API_URL || "http://localhost:3007"
);

// 🔁 REFUND SERVICE (3016)
export const refundApi = createApi(
  process.env.NEXT_PUBLIC_REFUND_API_URL || "http://localhost:3016"
);

// 🏪 VENDOR SERVICE (3012)
export const vendorApi = createApi(
  process.env.NEXT_PUBLIC_VENDOR_API_URL || "http://localhost:3012"
);

// 🔍 SEARCH SERVICE (3013)
export const searchApi = createApi(
  process.env.NEXT_PUBLIC_SEARCH_API_URL || "http://localhost:3013"
);

// 🚚 SHIPPING SERVICE (3014)
export const shippingApi = createApi(
  process.env.NEXT_PUBLIC_SHIPPING_API_URL || "http://localhost:3014"
);

// ⭐ RATING SERVICE (3008)
export const ratingApi = createApi(
  process.env.NEXT_PUBLIC_RATING_API_URL || "http://localhost:3008"
);

// 📊 ANALYTICS SERVICE (3011)
export const analyticsApi = createApi(
  process.env.NEXT_PUBLIC_ANALYTICS_API_URL || "http://localhost:3011"
);

// 📄 INVOICE SERVICE (3010)
export const invoiceApi = createApi(
  process.env.NEXT_PUBLIC_INVOICE_API_URL || "http://localhost:3010"
);

// 🔔 NOTIFICATION SERVICE (3018)
export const notificationApi = createApi(
  process.env.NEXT_PUBLIC_NOTIFICATION_API_URL || "http://localhost:3018"
);
