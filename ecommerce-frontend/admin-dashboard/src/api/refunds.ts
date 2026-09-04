import apiClient from "./client";

/* =====================================================
   GET ALL REFUNDS
===================================================== */

export const getRefunds = async () => {
  const { data } = await apiClient.get("/refunds/");

  return data;
};

/* =====================================================
   GET REFUNDS FOR AN ORDER
===================================================== */

export const getRefundsByOrder = async (
  orderId: string
) => {
  const { data } = await apiClient.get(
    `/refunds/order/${orderId}`
  );

  return data;
};

/* =====================================================
   CREATE REFUND
===================================================== */

export interface CreateRefundInput {
  orderId: string;
  paymentId: string;
  amount: number;
  reason?: string;
}

export const createRefund = async (
  refund: CreateRefundInput
) => {
  const { data } = await apiClient.post(
    "/refunds",
    refund
  );

  return data;
};

/* =====================================================
   UPDATE REFUND STATUS
===================================================== */

export const updateRefundStatus = async (
  id: string,
  status: string
) => {
  const { data } = await apiClient.patch(
    `/refunds/${id}`,
    {
      status,
    }
  );

  return data;
};

/* =====================================================
   APPROVE REFUND
===================================================== */

export const approveRefund = async (
  id: string
) => {
  return updateRefundStatus(
    id,
    "APPROVED"
  );
};
