import { Router } from "express";

import {
  createRefund,
  getAllRefunds,
  getRefundByOrder,
  updateRefundStatus,
} from "../controllers/refund.controller";

import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// CREATE REFUND
router.post("/", authMiddleware, createRefund);

// GET ALL REFUNDS
router.get("/", authMiddleware, getAllRefunds);

// GET REFUNDS BY ORDER
router.get("/order/:orderId", getRefundByOrder);

// UPDATE REFUND STATUS
router.patch("/:id", authMiddleware, updateRefundStatus);

export default router;
