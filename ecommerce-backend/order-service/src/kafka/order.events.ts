export interface OrderCreatedEvent {
  orderId: string;
  userId: string;
  userEmail: string;
  totalAmount: number;
  createdAt: string;
}

export interface OrderCancelledEvent {
  orderId: string;
  userId: string;
  userEmail: string;
  cancelledAt: string;
}

