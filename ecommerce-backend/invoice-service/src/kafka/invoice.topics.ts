// src/kafka/invoice.topics.ts
export const INVOICE_TOPICS = {
  // Incoming
  PAYMENT_SUCCESS: "payment.success",

  // Outgoing
  INVOICE_GENERATED: "invoice.generated",
} as const;

