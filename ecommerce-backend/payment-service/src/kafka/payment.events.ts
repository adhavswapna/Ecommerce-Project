export interface OrderCreatedEvent {
  orderId: string;
  userId: string;
  userEmail: string;
  totalAmount: number;
  createdAt: string;
}

export interface PaymentSuccessEvent {
  orderId: string;
  paymentId: string;
  amount: number;
  userEmail: string;
  completedAt: string;
}

export interface PaymentFailedEvent {
  orderId: string;
  reason: string;
  userEmail: string;
  failedAt: string;
}

