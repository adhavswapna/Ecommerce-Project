import { orderApi } from "./apiClient";

export const getUserOrders = async (userId: string) => {
  try {
    const res = await orderApi.get(`/orders/user/${userId}`);
    return res.data?.orders || res.data || [];
  } catch (err) {
    console.error("Orders API error:", err);
    return [];
  }
};

export const createOrder = async (payload: any) => {
  try {
    const res = await orderApi.post("/orders", payload);
    return res.data;
  } catch (err) {
    console.error("Create order error:", err);
    throw err;
  }
};
