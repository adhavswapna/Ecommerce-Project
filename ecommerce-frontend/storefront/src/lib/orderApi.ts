import { api } from "./api";

const ORDER_API = process.env.NEXT_PUBLIC_ORDER_API_URL;

if (!ORDER_API) {
  throw new Error("NEXT_PUBLIC_ORDER_API_URL not defined");
}

/**
 * Get all orders (for logged-in user)
 */
export const getOrders = async () => {
  try {
    const res = await api.get(`${ORDER_API}`);
    return res.data;
  } catch (error: any) {
    console.error("Get orders error:", error?.response?.data || error.message);
    throw new Error("Failed to fetch orders");
  }
};

/**
 * Get order by ID
 */
export const getOrderById = async (orderId: string) => {
  try {
    const res = await api.get(`${ORDER_API}/${orderId}`);
    return res.data;
  } catch (error: any) {
    console.error("Get order error:", error?.response?.data || error.message);
    throw new Error("Failed to fetch order");
  }
};
