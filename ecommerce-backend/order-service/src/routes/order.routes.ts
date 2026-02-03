import { Router } from "express";
import {
  createOrder,
  updateOrder,
  getOrders,
} from "../controllers/order.controller";

const router = Router();

// Create a new order
router.post("/", createOrder);

// Update an existing order
router.put("/:orderId", updateOrder);

// Get all orders (optional)
router.get("/", getOrders);

export default router;

