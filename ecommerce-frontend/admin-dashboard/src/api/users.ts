import apiClient from "./client";

export const getUsers = async () => {
  const { data } = await apiClient.get("/users");
  return data;
};

export const blockUser = async (userId: string) => {
  const { data } = await apiClient.post(`/users/${userId}/block`);
  return data;
};
