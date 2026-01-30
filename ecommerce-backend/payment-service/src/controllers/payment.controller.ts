import { Request, Response } from "express";
import {
  createPaymentService,
  getPaymentsByOrderService,
} from "../services/payment.service";

export const createPayment = async (req: Request, res: Response) => {
  try {
    const { orderId, amount, provider } = req.body;

    if (!orderId || !amount || !provider) {
      return res.status(400).json({
        message: "orderId, amount, provider are required",
      });
    }

    const payment = await createPaymentService(orderId, amount, provider);
    res.status(201).json(payment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment creation failed" });
  }
};

export const getPaymentsByOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const payments = await getPaymentsByOrderService(orderId);
    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch payments" });
  }
};

