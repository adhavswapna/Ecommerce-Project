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

router.get("/user/:userId", getOrdersByUser);
router.get("/:orderId", getOrderByIdController);

router.post("/confirm/:orderId", confirmOrder);
router.delete("/cancel/:orderId", cancelOrder);

export default router;

