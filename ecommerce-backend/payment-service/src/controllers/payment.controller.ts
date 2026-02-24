import { Request, Response } from "express";
import {
  createPaymentService,
  getPaymentsByOrderService,
  updatePaymentStatus,
  refundPaymentService,
  getPaymentStatusService,
} from "../services/payment.service";

export async function createPayment(req: Request, res: Response) {
  try {
    const { userId, orderId, amount, provider, currency } = req.body;

    if (!userId || !orderId || !amount || !provider || !currency) {
      return res.status(400).json({
        message: "userId, orderId, amount, provider, and currency are required",
      });
    }

    const payment = await createPaymentService(userId, orderId, amount, provider, currency);
    res.status(201).json(payment);
  } catch (err) {
    console.error("Error creating payment:", err);
    res.status(500).json({ message: "Payment creation failed" });
  }
}

export async function verifyPayment(req: Request, res: Response) {
  try {
    const { paymentId } = req.params;
    const { status, transactionId } = req.body;

    if (!status) {
      return res.status(400).json({ message: "status is required" });
    }

    const payment = await updatePaymentStatus(paymentId, status, transactionId);
    res.json(payment);
  } catch (err) {
    console.error("Error verifying payment:", err);
    res.status(500).json({ message: "Payment verification failed" });
  }
}

export async function refundPayment(req: Request, res: Response) {
  try {
    const { orderId } = req.params;
    const result = await refundPaymentService(orderId);
    res.json({ message: "Refund initiated", result });
  } catch (err) {
    console.error("Error refunding payment:", err);
    res.status(500).json({ message: "Refund failed" });
  }
}

export async function getPaymentStatus(req: Request, res: Response) {
  try {
    const { orderId } = req.params;
    const status = await getPaymentStatusService(orderId);
    res.json(status);
  } catch (err) {
    console.error("Error fetching payment status:", err);
    res.status(500).json({ message: "Failed to fetch payment status" });
  }
}

export async function getPaymentsByOrder(req: Request, res: Response) {
  try {
    const { orderId } = req.params;
    const payments = await getPaymentsByOrderService(orderId);
    res.json(payments);
  } catch (err) {
    console.error("Error fetching payments:", err);
    res.status(500).json({ message: "Failed to fetch payments" });
  }
}

