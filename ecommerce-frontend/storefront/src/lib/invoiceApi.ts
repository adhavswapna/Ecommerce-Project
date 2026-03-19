import { api } from "./api";

const PAYMENT_API = process.env.NEXT_PUBLIC_PAYMENT_API_URL;

if (!PAYMENT_API) {
  throw new Error("NEXT_PUBLIC_PAYMENT_API_URL not defined");
}

export const createPayment = async (orderId: string) => {
  try {
    const res = await api.post(`${PAYMENT_API}/payment/create`, {
      orderId,
    });
    return res.data;
  } catch (error: any) {
    console.error("Payment error:", error?.response?.data || error.message);
    throw new Error("Payment failed");
  }
};
