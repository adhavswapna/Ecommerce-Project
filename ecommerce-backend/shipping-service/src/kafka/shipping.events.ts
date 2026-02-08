export interface OrderCreatedEvent {
  orderId: string;
  userId: string;
  userEmail: string;
  createdAt: string;
}

export interface ShippingCreatedEvent {
  shipmentId: string;
  orderId: string;
  userEmail: string;
  status: "SHIPPED";
  shippedAt: string;
}

