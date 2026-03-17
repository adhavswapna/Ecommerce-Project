import { api } from "./api";

const USER_API = process.env.NEXT_PUBLIC_USER_API_URL;

if (!USER_API) throw new Error("NEXT_PUBLIC_USER_API_URL not defined");

/**
 * Get user info
 */
export const getUserInfo = async (userId: string) => {
  const res = await api.get(`${USER_API}/users/${userId}`);
  return res.data;
};

/**
 * Get user orders
 */
export const getUserOrders = async (userId: string) => {
  const res = await api.get(`${USER_API}/orders/${userId}`);
  return res.data;
};

/**
 * Get user invoices
 */
export const getUserInvoices = async (userId: string) => {
  const res = await api.get(`${USER_API}/invoices/${userId}`);
  return res.data;
};
