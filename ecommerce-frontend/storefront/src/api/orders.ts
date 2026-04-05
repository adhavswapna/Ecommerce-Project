import { orderApi } from "./apiClient";

/* ================= GET MY ORDERS ================= */
export const getUserOrders = async () => {
  const res = await orderApi.get("/orders/user"); // ✅ fixed
  return res.data;
};

/* ================= GET ORDER BY ID ================= */
export const getOrderById = async (orderId: string) => {
  const res = await orderApi.get(`/orders/${orderId}`);
  return res.data;
};

/* ================= CONFIRM ORDER ================= */
export const confirmOrder = async (orderId: string) => {
  const res = await orderApi.post(`/orders/confirm/${orderId}`);
  return res.data;
};

/* ================= REFUND ================= */
export const requestRefund = async (orderId: string) => {
  const res = await orderApi.post(`/refunds`, {
    orderId,
  });
  return res.data;
};
