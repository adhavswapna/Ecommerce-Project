
export const VENDOR_TOPICS = {
  /* =====================================================
     VENDOR
  ===================================================== */

  /**
   * Published when a vendor application is created.
   */
  VENDOR_CREATED:
    "vendor.created",

  /**
   * Published whenever the vendor approval status changes.
   *
   * Examples:
   *
   * PENDING → APPROVED
   * PENDING → REJECTED
   *
   * Consumers:
   * - Auth Service
   * - Other services that need vendor status
   */
  VENDOR_STATUS_UPDATED:
    "vendor.status.updated",

  /* =====================================================
     PRODUCT / ORDER EVENTS
  ===================================================== */

  /**
   * Published when a vendor's product is purchased.
   */
  PRODUCT_PURCHASED:
    "vendor.product.purchased",
} as const;

