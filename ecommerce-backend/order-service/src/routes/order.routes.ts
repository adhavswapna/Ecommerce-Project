import { Router } from "express";
import {
  createOrder,
  confirmOrder,
  cancelOrder,
  getOrderByIdController,
  getMyOrders,
} from "../controllers/order.controller";

// 🔥 import your auth middleware
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", createOrder);

// ✅ NEW (BEST PRACTICE)
router.get("/user", authMiddleware, getMyOrders);

router.get("/:orderId", getOrderByIdController);

router.post("/confirm/:orderId", confirmOrder);
router.delete("/cancel/:orderId", cancelOrder);

export default router;
