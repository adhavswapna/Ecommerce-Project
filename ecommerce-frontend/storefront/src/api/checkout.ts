import {
  createOrder,
} from "@/api/orders";

export const checkout =
  async (payload: any) => {
    return createOrder(
      payload
    );
  };
