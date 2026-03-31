import { paymentApi } from "./apiClient"; 

const PAYMENT_API = process.env.NEXT_PUBLIC_PAYMENT_API_URL;

// Get all payments for a user
export const getUserPayments = async (userId: string) => {
  try {
    const res = await api.get(`${PAYMENT_API}/user/${userId}`);
    return res.data?.payments || res.data || [];
  } catch (err: any) {
    console.error("Payments API FULL error:", err);

    if (err.response) {
      console.error("Payments API error:", err.response.status, err.response.data);
    } else if (err.request) {
      console.error("No response received:", err.request);
    } else {
      console.error("Error message:", err.message);
    }

    return [];
  }
};
