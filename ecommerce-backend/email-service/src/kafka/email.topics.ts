// src/kafka/email.topics.ts

export const EMAIL_TOPICS = {
  // User
  USER_REGISTERED: "user.registered",
  USER_VERIFIED: "user.verified",
  USER_DEACTIVATED: "user.deactivated",

  // Auth (Password Reset)
  AUTH_PASSWORD_RESET: "auth.password.reset",

  // Cart
  CART_CREATED: "cart.created",
  CART_UPDATED: "cart.updated",
  CART_ABANDONED: "cart.abandoned",

  // Order
  ORDER_CREATED: "order.created",
  ORDER_CANCELLED: "order.cancelled",
  ORDER_COMPLETED: "order.completed",

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
  INVENTORY_REPLENISHED: "inventory.replenished",

  // Shipping
  SHIPPING_CREATED: "shipping.created",
  SHIPPING_OUT_FOR_DELIVERY: "shipping.out_for_delivery",
  SHIPPING_DELIVERED: "shipping.delivered",
  SHIPPING_CANCELLED: "shipping.cancelled",

  // Rating & Reviews
  RATING_SUBMITTED: "rating.submitted",
  RATING_UPDATED: "rating.updated",

  // Analytics
  ANALYTICS_REPORT_GENERATED: "analytics.report.generated",

  // Search
  SEARCH_QUERY_LOGGED: "search.query.logged",
  SEARCH_RESULT_CLICKED: "search.result.clicked",
} as const;

export type EmailTopic = typeof EMAIL_TOPICS[keyof typeof EMAIL_TOPICS];

