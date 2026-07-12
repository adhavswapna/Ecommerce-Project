import apiClient from "./client";

export const getRefunds = async () => {
  const { data } = await apiClient.get("/refunds");
  return data;
};

export const approveRefund = async (id: string) => {
  const { data } = await apiClient.post(`/refunds/${id}/approve`);
  return data;
};
