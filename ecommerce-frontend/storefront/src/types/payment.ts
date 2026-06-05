// src/types/payment.ts

export interface Payment {
  id: string;

  userId: string;

  orderId: string;

  amount: number;

  provider: string;

  currency: string;

  status:
    | "PENDING"
    | "SUCCESS"
    | "FAILED"
    | "REFUNDED";

  transactionId?: string | null;

  cardNumber?: string | null;

  name?: string | null;

  refundedAmount: number;

  createdAt: string;

  updatedAt: string;
}

export interface CreatePaymentPayload {
  userId: string;

  orderId: string;

  amount: number;

  provider: string;

  currency: string;

  cardNumber?: string;

  name?: string;
}
