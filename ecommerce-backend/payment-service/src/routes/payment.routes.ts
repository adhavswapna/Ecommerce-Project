import { Router } from "express";
import {
  createPayment,
  verifyPayment,
  refundPayment,
  getPaymentStatus,
  getPaymentsByOrder,
} from "../controllers/payment.controller";

const router = Router();

router.post("/", createPayment);
router.post("/verify/:paymentId", verifyPayment);
router.post("/refund/:orderId", refundPayment);
router.get("/status/:orderId", getPaymentStatus);
router.get("/order/:orderId", getPaymentsByOrder);

export default router;

