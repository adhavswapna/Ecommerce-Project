import { refundApi } from "./apiClient";

export const createRefund = async (data: any) => {
  const res = await refundApi.post("/refunds", data);
  return res.data;
};
