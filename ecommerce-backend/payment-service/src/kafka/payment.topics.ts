export const PAYMENT_TOPICS = {
  // Incoming
  ORDER_CREATED: "order.created",

  // Outgoing (email-service already knows these)
  PAYMENT_SUCCESS: "payment.success",
  PAYMENT_FAILED: "payment.failed",
} as const;

