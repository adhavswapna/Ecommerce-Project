import apiClient from "./client";

/* =====================================================
   GET PLATFORM / ADMIN ANALYTICS
===================================================== */

export const getPlatformAnalytics = async () => {
  const { data } = await apiClient.get("/analytics/admin");

  return data;
};
