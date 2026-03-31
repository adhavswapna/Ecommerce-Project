import { productApi } from "./apiClient";

export const getProducts = async () => {
  const res = await productApi.get("/products");
  return res.data;
};

export const getProductById = async (id: string) => {
  const res = await productApi.get(`/products/${id}`);
  return res.data;
};
