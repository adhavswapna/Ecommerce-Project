import apiClient from "./client";

export const createProduct = async (
  payload: any
) => {
  const { data } =
    await apiClient.post(
      "/products",
      payload
    );

  return data;
};

export const getVendorProducts =
  async () => {
    const { data } =
      await apiClient.get(
        "/products/vendor"
      );

    return data;
  };
