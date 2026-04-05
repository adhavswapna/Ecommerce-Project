import { paymentApi } from "./apiClient";

export const createPayment = async (data: any) => {
  const res = await paymentApi.post("/payments", data);
  return res.data;
};
