import { api } from "../axios";

const BASE = process.env.NEXT_PUBLIC_PRODUCT_API_URL;

export const getProducts = async () => {
  const res = await api.get(`${BASE}/products`);
  return res.data;
};

export const getProductById = async (id: string) => {
  const res = await api.get(`${BASE}/products/${id}`);
  return res.data;
};

