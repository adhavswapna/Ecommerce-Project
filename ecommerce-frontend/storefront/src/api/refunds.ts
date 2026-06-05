import {
  refundApi,
} from "@/api/apiClient";

export const getRefunds =
  async () => {
    const response =
      await refundApi.get(
        "/refunds"
      );

    return response.data;
  };

export const createRefund =
  async (payload: {
    orderId: string;
    reason: string;
  }) => {
    const response =
      await refundApi.post(
        "/refunds",
        payload
      );

    return response.data;
  };
