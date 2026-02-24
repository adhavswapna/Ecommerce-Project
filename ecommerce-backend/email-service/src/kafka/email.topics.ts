// src/kafka/email.topics.ts

export const EMAIL_TOPICS = {
  // User
  USER_REGISTERED: "user.registered",
  USER_VERIFIED: "user.verified",

  // Order
  ORDER_CREATED: "order.created",
  ORDER_CANCELLED: "order.cancelled",

  // Payment
  PAYMENT_SUCCESS: "payment.success",
  PAYMENT_FAILED: "payment.failed",
  PAYMENT_REFUNDED: "payment.refunded",

  // Invoice
  INVOICE_GENERATED: "invoice.generated",

  // Vendor
  VENDOR_CREATED: "vendor.created",
  VENDOR_APPROVED: "vendor.approved",
  VENDOR_REJECTED: "vendor.rejected",

  // Inventory
  INVENTORY_LOW: "inventory.low",
  INVENTORY_OUT_OF_STOCK: "inventory.out_of_stock",

  // Shipping
  SHIPPING_CREATED: "shipping.created",
  SHIPPING_OUT_FOR_DELIVERY: "shipping.out_for_delivery",
  SHIPPING_DELIVERED: "shipping.delivered",
  SHIPPING_CANCELLED: "shipping.cancelled",

  // Auth (Password Reset)
  AUTH_PASSWORD_RESET: "auth.password.reset",
} as const;

export type EmailTopic = typeof EMAIL_TOPICS[keyof typeof EMAIL_TOPICS];

