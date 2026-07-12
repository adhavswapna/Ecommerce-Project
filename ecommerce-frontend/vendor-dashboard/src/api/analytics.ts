import apiClient from "./client";

export const getVendorAnalytics = async () => {
  const { data } = await apiClient.get("/analytics/vendor");
  return data;
};
