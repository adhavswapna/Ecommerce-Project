import { api } from "../axios";

const BASE = process.env.NEXT_PUBLIC_CART_API_URL;

export const getCart = async () => api.get(`${BASE}/cart`);
export const addToCart = async (productId: string, qty = 1) =>
  api.post(`${BASE}/cart`, { productId, qty });

export const removeFromCart = async (productId: string) =>
  api.delete(`${BASE}/cart/${productId}`);

