import { api } from "./api";

const REFUND_API = process.env.NEXT_PUBLIC_REFUND_API_URL;

export const requestRefund = async (orderId: string) => {
  try {
    const res = await api.post(`${REFUND_API}/refunds`, {
      orderId,
    });
    return res.data;
  } catch (error: any) {
    console.error("Refund error:", error?.response?.data || error.message);
    throw new Error("Refund failed");
  }
};
