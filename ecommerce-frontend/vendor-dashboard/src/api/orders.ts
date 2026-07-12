import apiClient from "./client";

export const getVendorOrders = async () => {
  const { data } = await apiClient.get("/orders/vendor");
  return data;
};
