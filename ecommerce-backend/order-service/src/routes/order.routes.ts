import { Router } from "express";
import {
  createOrder,
  confirmOrder,
  cancelOrder,
  getOrderByIdController,
  getMyOrders,
} from "../controllers/order.controller";

import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

/* ================= CREATE ORDER ================= */
router.post("/", authMiddleware, createOrder);

/* ================= GET MY ORDERS ================= */
router.get("/my", authMiddleware, getMyOrders);

/* ================= GET ORDER BY ID ================= */
router.get("/:orderId", authMiddleware, getOrderByIdController);

/* ================= CONFIRM ORDER ================= */
router.post("/confirm/:orderId", authMiddleware, confirmOrder);

/* ================= CANCEL ORDER ================= */
router.delete("/cancel/:orderId", authMiddleware, cancelOrder);

export default router;
