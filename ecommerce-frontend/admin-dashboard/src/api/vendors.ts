import apiClient from "./client";

export const getVendors = async () => {
  const { data } = await apiClient.get("/vendors");
  return data;
};

export const approveVendor = async (id: string) => {
  const { data } = await apiClient.post(`/vendors/${id}/approve`);
  return data;
};

export const rejectVendor = async (id: string) => {
  const { data } = await apiClient.post(`/vendors/${id}/reject`);
  return data;
};
