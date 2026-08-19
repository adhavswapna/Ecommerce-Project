import API from "../services/api";

export const getVendorOrders = async () => {
  const { data } = await API.get(
    "/orders/vendor"
  );

  return data;
};
