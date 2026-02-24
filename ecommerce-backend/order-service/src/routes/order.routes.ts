import { Router } from "express";
import {
  createOrder,
  confirmOrder,
  cancelOrder,
  getOrderByIdController,
  getOrdersByUser,
} from "../controllers/order.controller";

const router = Router();

router.post("/", createOrder);
router.post("/confirm/:orderId", confirmOrder);
router.delete("/cancel/:orderId", cancelOrder);
router.get("/:orderId", getOrderByIdController);
router.get("/user/:userId", getOrdersByUser);

export default router;

