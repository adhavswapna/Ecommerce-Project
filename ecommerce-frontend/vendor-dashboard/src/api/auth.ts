import apiClient from "./client";

export const login = async (
  email: string,
  password: string
) => {
  const { data } =
    await apiClient.post(
      "/auth/login",
      {
        email,
        password,
      }
    );

  // IMPORTANT:
  // client.ts reads vendorToken
  localStorage.setItem(
    "vendorToken",
    data.token
  );

  // Optional but useful
  if (data.user) {
    localStorage.setItem(
      "vendorUser",
      JSON.stringify(data.user)
    );
  }

  return data;
};
