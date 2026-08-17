import { paymentApi } from "./apiClient";

// ========================
// CREATE PAYMENT
// ========================
export const createPayment = async (payload: any) => {
const res = await paymentApi.post("/", payload);

return res.data;
};

// ========================
// INITIATE PAYMENT
// ========================
export const initiatePayment = async (payload: any) => {
const res = await paymentApi.post("/", payload);

return res.data;
};

// ========================
// VERIFY PAYMENT
// ========================
export const verifyPayment = async (paymentId: string) => {
const res = await paymentApi.post(
`/verify/${paymentId}`
);

return res.data;
};

// ========================
// GET PAYMENT STATUS
// ========================
export const getPaymentStatus = async (orderId: string) => {
const res = await paymentApi.get(
`/status/${orderId}`
);

return res.data;
};

// ========================
// REFUND PAYMENT
// ========================
export const refundPayment = async (orderId: string) => {
const res = await paymentApi.post(
`/refund/${orderId}`
);

return res.data;
};

