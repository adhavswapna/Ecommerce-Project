
// lib/api/payment.api.ts
import { api } from "../axios";

const BASE = process.env.NEXT_PUBLIC_PAYMENT_API_URL;

// Create Payment
export const createPayment = async (paymentData: {
  userId: string;
  orderId: string;
  amount: number;
  provider: "cod" | "card" | "upi" | "netbanking";
  currency: "INR" | "USD";
  name?: string;
  cardNumber?: string;
}) => {
  const { data } = await api.post(`${BASE}/payment`, paymentData);
  return data;
};

// Verify Payment
export const verifyPayment = async (
  paymentId: string,
  status: "SUCCESS" | "FAILED",
  transactionId?: string
) => {
  const { data } = await api.post(`${BASE}/payment/verify/${paymentId}`, {
    status,
    transactionId,
  });
  return data;
};

// Refund Payment
export const refundPayment = async (orderId: string) => {
  const { data } = await api.post(`${BASE}/payment/refund/${orderId}`);
  return data;
};

// Get Payment Status
export const getPaymentStatus = async (orderId: string) => {
  const { data } = await api.get(`${BASE}/payment/status/${orderId}`);
  return data;
};

// Get Payments by Order
export const getPaymentsByOrder = async (orderId: string) => {
  const { data } = await api.get(`${BASE}/payment/order/${orderId}`);
  return data;
};

