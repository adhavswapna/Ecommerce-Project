import { api } from "@/lib/api";
import { Product } from "@/types/product";

const PRODUCT_API = process.env.NEXT_PUBLIC_PRODUCT_API_URL;

/* ================= SAFETY CHECK ================= */
if (!PRODUCT_API) {
  throw new Error("NEXT_PUBLIC_PRODUCT_API_URL is not defined");
}

/* ================= GET ALL PRODUCTS ================= */
export const getProducts = async (): Promise<Product[]> => {
  try {
    const res = await api.get(`${PRODUCT_API}/products`);

    // handle different backend formats
    return res.data?.data || res.data || [];
  } catch (error: any) {
    console.error(
      "❌ Error fetching products:",
      error?.response?.data || error.message
    );

    throw new Error(
      error?.response?.data?.message || "Failed to fetch products"
    );
  }
};

/* ================= GET PRODUCT BY ID ================= */
export const getProductById = async (id: string): Promise<Product> => {
  try {
    const res = await api.get(`${PRODUCT_API}/products/${id}`);

    return res.data?.data || res.data;
  } catch (error: any) {
    console.error(
      `❌ Error fetching product ${id}:`,
      error?.response?.data || error.message
    );

    throw new Error(
      error?.response?.data?.message || "Failed to fetch product"
    );
  }
};

/* ================= GET PRODUCT STOCK ================= */
export const getProductStock = async (id: string): Promise<number> => {
  try {
    const res = await api.get(`${PRODUCT_API}/products/stock/${id}`);

    return res.data?.stock ?? 0;
  } catch (error: any) {
    console.error(
      `❌ Error fetching stock for ${id}:`,
      error?.response?.data || error.message
    );

    throw new Error(
      error?.response?.data?.message || "Failed to fetch stock"
    );
  }
};
