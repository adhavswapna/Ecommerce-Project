export interface OrderCreatedEvent {
  orderId: string;
  userId: string;
  totalAmount: number;
  status: "CREATED";
  createdAt: string;
}

export interface OrderUpdatedEvent {
  orderId: string;
  status: "CONFIRMED" | "CANCELLED" | "SHIPPED";
  updatedAt: string;
}

