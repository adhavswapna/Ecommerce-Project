import { api } from "../axios";

const BASE = process.env.NEXT_PUBLIC_PAYMENT_API_URL;

export const initiatePayment = async (orderId: string) =>
  api.post(`${BASE}/pay`, { orderId });

