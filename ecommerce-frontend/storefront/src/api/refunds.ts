import { refundApi } from "./apiClient";

export const getRefundsByOrderId = async (orderId: string) => {
  try {
    const res = await refundApi.get(`/refunds/order/${orderId}`);
    return res.data || [];
  } catch (err) {
    console.error("Refunds API error:", err);
    return [];
  }
};
