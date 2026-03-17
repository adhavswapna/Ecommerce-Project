export type RefundStatus =
  | "REQUESTED"
  | "APPROVED"
  | "REJECTED"
  | "PICKED_UP"
  | "COMPLETED";

export interface Refund {
  id: number;
  orderId: number;
  userId: number;
  reason: string;
  status: RefundStatus;
  createdAt: Date;
  updatedAt: Date;
}
