export interface PaymentCompletedEvent {
  orderId: string;
  paymentId: string;
  amount: number;
  status: "SUCCESS" | "FAILED";
  completedAt: string;
}

export interface InvoiceGeneratedEvent {
  invoiceId: string;
  orderId: string;
  amount: number;
  createdAt: string;
}

