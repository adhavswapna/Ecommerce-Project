import axios from "axios";

const API_URL = "http://localhost:8081/api";

/* =====================================================
   GET ALL PRODUCTS
   GET /products
===================================================== */

export const getProducts = async () => {
  try {
    console.group("📦 GET PRODUCTS");

    console.log("Calling GET /products...");

    const res = await axios.get(`${API_URL}/products/`, {
      timeout: 30000,
      withCredentials: false,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    console.log("Status:", res.status);
    console.log("Data:", res.data);

    console.groupEnd();

    /*
      Backend may return either:

      [
        {...},
        {...}
      ]

      OR:

      {
        success: true,
        data: [...]
      }
    */

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
    console.log("Response:", error.response);
    console.log("Full Error:", error);

    console.groupEnd();

    throw error;
  }
};

/* =====================================================
   GET PRODUCT BY ID
   GET /products/:id
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

    /*
      Backend response:

      {
        success: true,
        data: {
          id,
          name,
          price,
          stock,
          images: [...]
        }
      }

      Return ONLY data so ProductDetails
      receives the actual Product object.
    */

    if (res.data?.data) {
      console.log(
        "✅ Product extracted:",
        res.data.data
      );

      console.log(
        "🖼️ Product images:",
        res.data.data.images
      );

      return res.data.data;
    }

    /*
      Fallback in case another endpoint
      returns the product directly.
    */

    return res.data;
  } catch (error: any) {
    console.group("❌ GET PRODUCT FAILED");

    console.log("Message:", error.message);
    console.log("Code:", error.code);
    console.log(
      "Request URL:",
      error.config?.url
    );
    console.log(
      "Response:",
      error.response
    );
    console.log(
      "Full Error:",
      error
    );

    console.groupEnd();

    throw error;
  }
};

/* =====================================================
   SEARCH PRODUCTS
   GET /search?q=
===================================================== */

export const searchProducts = async (
  query: string
) => {
  try {
    console.group("🔍 SEARCH PRODUCTS");

    console.log("Query:", query);

    const res = await axios.get(
      `${API_URL}/search/`,
      {
        timeout: 30000,
        withCredentials: false,
        params: {
          q: query,
        },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

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
    console.group(
      "❌ SEARCH PRODUCTS FAILED"
    );

    console.log(
      "Message:",
      error.message
    );

    console.log(
      "Code:",
      error.code
    );

    console.log(
      "Response:",
      error.response
    );

    console.log(
      "Full Error:",
      error
    );

    console.groupEnd();

    throw error;
  }
};
