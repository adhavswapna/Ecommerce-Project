import { Router } from "express";
import {
  createPayment,
  verifyPayment,
  refundPayment,
  getPaymentStatus,
  getPaymentsByOrder,
  getPaymentsByUser,
  markPaymentSuccess, // ✅ NEW
} from "../controllers/payment.controller";

const router = Router();

// ------------------------
// CREATE PAYMENT
// ------------------------
router.post("/", createPayment);

// ------------------------
// VERIFY PAYMENT (for online payments)
// ------------------------
router.post("/verify/:paymentId", verifyPayment);

// ------------------------
// ✅ OPTIONAL: MANUAL SUCCESS (for testing / COD fallback)
// ------------------------
router.put("/success/:paymentId", markPaymentSuccess);

// ------------------------
// REFUND PAYMENT
// ------------------------
router.post("/refund/:orderId", refundPayment);

// ------------------------
// GET LATEST PAYMENT STATUS
// ------------------------
router.get("/status/:orderId", getPaymentStatus);

// ------------------------
// GET ALL PAYMENTS FOR AN ORDER
// ------------------------
router.get("/order/:orderId", getPaymentsByOrder);

// ------------------------
// GET ALL PAYMENTS FOR A USER
// ------------------------
router.get("/user/:userId", getPaymentsByUser);

export default router;
