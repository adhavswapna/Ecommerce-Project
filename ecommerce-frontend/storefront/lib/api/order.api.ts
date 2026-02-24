// lib/api/order.api.ts
import { api } from "../axios";
import { Order } from "@/types/order";

const BASE = process.env.NEXT_PUBLIC_ORDER_API_URL;

// Create Order
export const createOrder = async (orderData: {
  userId: string;
  totalAmount: number;
  currency: "INR" | "USD";
  paymentMethod: "cod" | "card" | "upi" | "netbanking";
  items: { productId: string; quantity: number; price: number }[];
}): Promise<Order> => {
  const { data } = await api.post(`${BASE}/orders`, orderData);
  return data;
};

// Get My Orders
export const getMyOrders = async (userId: string): Promise<Order[]> => {
  const { data } = await api.get(`${BASE}/orders/user/${userId}`);
  return data;
};

// Get Order By ID
export const getOrderById = async (id: string): Promise<Order> => {
  const { data } = await api.get(`${BASE}/orders/${id}`);
  return data;
};

// Confirm Order
export const confirmOrder = async (orderId: string): Promise<Order> => {
  const { data } = await api.post(`${BASE}/orders/confirm/${orderId}`);
  return data;
};

// Cancel Order
export const cancelOrder = async (orderId: string): Promise<Order> => {
  const { data } = await api.delete(`${BASE}/orders/cancel/${orderId}`);
  return data;
};

