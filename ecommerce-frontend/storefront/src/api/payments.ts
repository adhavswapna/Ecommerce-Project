import { apiClient } from "./apiClient";



export const createPayment = async (
  payload: any
) => {

  const res =
    await apiClient.post(
      "/payment/create",
      payload
    );


  return res.data;
};





export const initiatePayment = async (
  orderId: string
) => {

  const res =
    await apiClient.post(
      "/payment/initiate",
      {
        orderId,
      }
    );


  return res.data;
};





export const verifyPayment = async (
  paymentId: string
) => {

  const res =
    await apiClient.post(
      "/payment/verify",
      {
        paymentId,
      }
    );


  return res.data;
};
