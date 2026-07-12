import apiClient from "./client";

export const getPlatformAnalytics = async () => {
  const { data } = await apiClient.get("/analytics");
  return data;
};
