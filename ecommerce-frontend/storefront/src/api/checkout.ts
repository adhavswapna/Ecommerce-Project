import { orderApi } from "./apiClient";

export const createOrder = async (data: any) => {
  const res = await orderApi.post("/orders", data);
  return res.data;
};

export const confirmOrder = async (orderId: string) => {
  const res = await orderApi.post(`/orders/confirm/${orderId}`);
  return res.data;
};
