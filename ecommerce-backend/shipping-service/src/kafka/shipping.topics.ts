export const SHIPPING_TOPICS = {
  PAYMENT_SUCCESS: "payment.success",   // 👈 incoming from payment-service

  SHIPPING_CREATED: "shipping.created",
  SHIPPING_OUT_FOR_DELIVERY: "shipping.out_for_delivery",
  SHIPPING_DELIVERED: "shipping.delivered",
  SHIPPING_CANCELLED: "shipping.cancelled",
} as const;
