export interface RefundRequestedEvent {
  refundId: number;
  orderId: number;
  userId: number;
  reason: string;
}

export interface RefundApprovedEvent {
  refundId: number;
  orderId: number;
}

export interface RefundRejectedEvent {
  refundId: number;
  orderId: number;
  reason: string;
}

export interface RefundCompletedEvent {
  refundId: number;
  orderId: number;
}
