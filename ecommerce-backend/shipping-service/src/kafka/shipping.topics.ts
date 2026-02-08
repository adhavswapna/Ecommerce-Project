// src/kafka/shipping.topics.ts
export const SHIPPING_TOPICS = {
  ORDER_PAID: "order.paid",
  ORDER_SHIPPED: "order.shipped",
  SHIPPING_CREATED: "shipping.created",
  SHIPPING_OUT_FOR_DELIVERY: "shipping.out_for_delivery",
  SHIPPING_DELIVERED: "shipping.delivered",
  SHIPPING_CANCELLED: "shipping.cancelled",
} as const;

