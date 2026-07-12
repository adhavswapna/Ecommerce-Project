import { orderApi } from "@/api/apiClient";

/* =========================================
   CHECKOUT SERVICE (Amazon-style abstraction)
========================================= */

export interface CheckoutPayload {
  userId: string;
  totalAmount: number;
  paymentMethod: string;
  currency: string;

  address: {
    addressLine1: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };

  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
}

/* CREATE ORDER */
export const createCheckoutOrder = async (
  payload: CheckoutPayload
) => {
  const { data } = await orderApi.post("/orders", payload);
  return data;
};

/* CONFIRM ORDER */
export const confirmOrder = async (orderId: string) => {
  const { data } = await orderApi.post(
    `/orders/confirm/${orderId}`
  );
  return data;
};
