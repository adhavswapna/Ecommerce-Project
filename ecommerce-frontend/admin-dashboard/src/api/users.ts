import apiClient from "./client";

/* =====================================================
   GET ALL USERS
===================================================== */

export const getUsers = async () => {
  const { data } = await apiClient.get("/users");

  // Backend returns:
  // {
  //   data: [...]
  // }

  return Array.isArray(data) ? data : data?.data || [];
};

/* =====================================================
   BLOCK USER
===================================================== */

export const blockUser = async (userId: string) => {
  const { data } = await apiClient.post(
    `/users/${userId}/block`
  );

  return data;
};
