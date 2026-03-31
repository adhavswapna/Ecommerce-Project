import { Router } from "express";
import {
  createRefund,
  getRefundByOrder,
  updateRefundStatus,
} from "../controllers/refund.controller";

import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// 🔥 MUST PROTECT THIS ROUTE
router.post("/", authMiddleware, createRefund);

router.get("/order/:orderId", getRefundByOrder);

router.patch("/:id", authMiddleware, updateRefundStatus);

export default router;
