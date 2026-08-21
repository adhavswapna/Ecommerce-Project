import axios from "axios";

const API_URL = "http://localhost:8081/api";

/* =====================================================
   GET PRODUCTS
   GET /products
   Optional category filter
===================================================== */

export const getProducts = async (category?: string) => {
  try {
    console.group("📦 GET PRODUCTS");

    console.log("Category:", category || "ALL");

    const res = await axios.get(`${API_URL}/products/`, {
      timeout: 30000,
      withCredentials: false,
      params: category
        ? {
            category,
          }
        : undefined,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    console.log("Status:", res.status);
    console.log("Data:", res.data);

    console.groupEnd();

    if (Array.isArray(res.data)) {
      return res.data;
    }

    if (Array.isArray(res.data?.data)) {
      return res.data.data;
    }

    return [];
  } catch (error: any) {
    console.group("❌ GET PRODUCTS FAILED");

    console.log("Message:", error.message);
    console.log("Code:", error.code);
    console.log("Request URL:", error.config?.url);
    console.log("Request Params:", error.config?.params);
    console.log("Response:", error.response);
    console.log("Full Error:", error);

    console.groupEnd();

    throw error;
  }
};

/* =====================================================
   GET PRODUCT BY ID
===================================================== */

export const getProductById = async (id: string) => {
  try {
    console.group("📦 GET PRODUCT");

    console.log("Product ID:", id);

    const res = await axios.get(
      `${API_URL}/products/${id}`,
      {
        timeout: 30000,
        withCredentials: false,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Status:", res.status);
    console.log("Raw Data:", res.data);

    console.groupEnd();

    if (res.data?.data) {
      return res.data.data;
    }

    return res.data;
  } catch (error: any) {
    console.group("❌ GET PRODUCT FAILED");

    console.log("Message:", error.message);
    console.log("Code:", error.code);
    console.log("Request URL:", error.config?.url);
    console.log("Response:", error.response);
    console.log("Full Error:", error);

    console.groupEnd();

    throw error;
  }
};

/* =====================================================
   SEARCH PRODUCTS
===================================================== */

export const searchProducts = async (query: string) => {
  try {
    console.group("🔍 SEARCH PRODUCTS");

    console.log("Query:", query);

    const res = await axios.get(`${API_URL}/search/`, {
      timeout: 30000,
      withCredentials: false,
      params: {
        q: query,
      },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    console.log("Status:", res.status);
    console.log("Data:", res.data);

    console.groupEnd();

    if (Array.isArray(res.data)) {
      return res.data;
    }

    if (Array.isArray(res.data?.data)) {
      return res.data.data;
    }

    return [];
  } catch (error: any) {
    console.group("❌ SEARCH PRODUCTS FAILED");

    console.log("Message:", error.message);
    console.log("Code:", error.code);
    console.log("Response:", error.response);
    console.log("Full Error:", error);

    console.groupEnd();

    throw error;
  }
};
