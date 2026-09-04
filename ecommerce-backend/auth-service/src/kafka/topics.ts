
export const KAFKA_TOPICS = {
  /* =====================================================
     USER / AUTH
  ===================================================== */

  /**
   * Published whenever Auth Service creates an AuthUser.
   *
   * Consumers:
   * - User Service
   * - Vendor Service
   *
   * For vendors, this is published during
   * self-registration, before admin approval.
   */
  AUTH_USER_CREATED:
    "auth.user.created",

  /**
   * Published when a user successfully logs in.
   */
  AUTH_USER_LOGGED_IN:
    "auth.user.logged_in",

  /* =====================================================
     PASSWORD RESET / EMAIL
  ===================================================== */

  /**
   * Password reset / email notification event.
   */
  AUTH_PASSWORD_RESET:
    "auth.password.reset",

  /* =====================================================
     VENDOR
  ===================================================== */

  /**
   * Published by Vendor Service when the vendor
   * approval status changes.
   *
   * Example:
   *
   * PENDING → APPROVED
   * PENDING → REJECTED
   *
   * Auth Service consumes this event and updates
   * AuthUser.vendorStatus.
   */
  VENDOR_STATUS_UPDATED:
    "vendor.status.updated",
} as const;

