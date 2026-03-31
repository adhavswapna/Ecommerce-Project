// src/kafka/invoice.topics.ts

export const INVOICE_TOPICS = {
  // Incoming event (from order-service / payment-service)
  INVOICE_REQUESTED: "invoice.requested",

  // Outgoing event
  INVOICE_GENERATED: "invoice.generated",
} as const;
