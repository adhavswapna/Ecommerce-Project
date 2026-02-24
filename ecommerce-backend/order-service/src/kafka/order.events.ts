export interface OrderCreatedEvent {
  orderId: string;
  userId: string;
  totalAmount: number;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
}

export interface OrderCancelledEvent {
  orderId: string;
  userId: string;
}

