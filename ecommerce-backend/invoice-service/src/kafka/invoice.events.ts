// src/kafka/invoice.events.ts

export interface PaymentSuccessEvent {
  orderId: string;
  paymentId: string;
  amount: number;
  userEmail: string;
  vendorEmail?: string;
  customerName?: string;
  billingAddress?: string;
  shippingAddress?: string;
  vendorName?: string;
  items?: Array<{
    description: string;
    unitPrice: number;
    quantity: number;
    taxRate: number;
  }>;
  completedAt?: string;
}

export interface InvoiceGeneratedEvent {
  invoiceId: string;
  orderId: string;
  amount: number;
  userEmail: string;
  vendorEmail?: string;
  invoiceUrl: string;
  createdAt: string;
}
