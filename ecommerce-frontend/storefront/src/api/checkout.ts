
import { orderApi } from "@/api/apiClient";

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
  const { data } = await orderApi.post("/", payload);
  return data;
};

/* CONFIRM ORDER */
export const confirmOrder = async (orderId: string) => {
  const { data } = await orderApi.post(`/confirm/${orderId}`);
  return data;
};
