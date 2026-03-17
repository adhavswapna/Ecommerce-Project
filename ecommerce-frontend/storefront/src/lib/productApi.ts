import { api } from "@/lib/api";
import { Product } from "@/types/product";

const PRODUCT_API = process.env.NEXT_PUBLIC_PRODUCT_API_URL;

// ✅ Safety check
if (!PRODUCT_API) {
  throw new Error("NEXT_PUBLIC_PRODUCT_API_URL is not defined");
}

/**
 * Get all products
 */
export const getProducts = async (): Promise<Product[]> => {
  try {
    const res = await api.get(`${PRODUCT_API}/`);
    return res.data;
  } catch (error: any) {
    console.error("Error fetching products:", error?.response?.data || error.message);
    throw new Error("Failed to fetch products");
  }
};

/**
 * Get product by ID
 */
export const getProductById = async (id: string): Promise<Product> => {
  try {
    const res = await api.get(`${PRODUCT_API}/${id}`);
    return res.data;
  } catch (error: any) {
    console.error(`Error fetching product ${id}:`, error?.response?.data || error.message);
    throw new Error("Failed to fetch product");
  }
};

/**
 * (Optional - useful for later)
 * Get product stock
 */
export const getProductStock = async (id: string): Promise<number> => {
  try {
    const res = await api.get(`${PRODUCT_API}/stock/${id}`);
    return res.data.stock;
  } catch (error: any) {
    console.error(`Error fetching stock for ${id}:`, error?.response?.data || error.message);
    throw new Error("Failed to fetch stock");
  }
};
