export interface OrderCreatedEvent {
  orderId: string;
  userId: string;
  totalAmount: number;
  status: "CREATED";
  createdAt: string;
}

export interface PaymentCompletedEvent {
  orderId: string;
  paymentId: string;
  amount: number;
  status: "SUCCESS" | "FAILED";
  completedAt: string;
}

