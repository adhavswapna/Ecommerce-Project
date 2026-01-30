import { Router } from "express";
import {
  createPayment,
  getPaymentsByOrder,
} from "../controllers/payment.controller";

const router = Router();

router.post("/", createPayment);
router.get("/order/:orderId", getPaymentsByOrder);

export default router;

