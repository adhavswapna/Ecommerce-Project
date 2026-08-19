import API from "../services/api";

export const login = async (
  email: string,
  password: string
) => {
  const { data } = await API.post(
    "/auth/login",
    {
      email,
      password,
    }
  );

  if (data.token) {
    localStorage.setItem(
      "vendorToken",
      data.token
    );
  }

  if (data.user) {
    localStorage.setItem(
      "vendorUser",
      JSON.stringify(data.user)
    );
  }

  return data;
};
