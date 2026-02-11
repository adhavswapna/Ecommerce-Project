import { api } from "../axios";

const BASE = process.env.NEXT_PUBLIC_ORDER_API_URL;

export const createOrder = async () =>
  api.post(`${BASE}/orders`);

export const getMyOrders = async () =>
  api.get(`${BASE}/orders`);

