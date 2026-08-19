import API from "../services/api";

export const getVendorAnalytics = async () => {
  const { data } = await API.get("/analytics/vendor");

  return data;
};
