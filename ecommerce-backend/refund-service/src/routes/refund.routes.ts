import { Router } from "express";
import {
  createRefund,
  getRefundByOrder,
  updateRefundStatus,
} from "../controllers/refund.controller";

const router = Router();

/**
 * Create refund (manual / admin fallback)
 * POST /refunds
 */
router.post("/", createRefund);

/**
 * Get refunds for an order
 * GET /refunds/order/:orderId
 */
router.get("/order/:orderId", getRefundByOrder);

/**
 * Update refund status (admin)
 * PATCH /refunds/:id
 */
router.patch("/:id", updateRefundStatus);

export default router;
