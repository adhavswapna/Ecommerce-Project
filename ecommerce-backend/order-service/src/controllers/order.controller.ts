import { Request, Response } from "express";
import {
  placeOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} from "../services/order.service";

/* ================= CREATE ORDER ================= */
export async function createOrder(req: Request, res: Response) {
  try {
    const { userId, totalAmount, currency, paymentMethod, items } = req.body;

    if (!userId || !totalAmount || !paymentMethod || !items) {
      return res.status(400).json({
        message: "userId, totalAmount, paymentMethod and items are required",
      });
    }

    const order = await placeOrder(
      userId,
      totalAmount,
      currency,
      paymentMethod,
      items
    );

    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/* ================= ✅ GET MY ORDERS (NEW) ================= */
export async function getMyOrders(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId; // 🔥 from auth middleware

    const orders = await getOrders(userId);
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/* ================= GET ORDER BY ID ================= */
export async function getOrderByIdController(req: Request, res: Response) {
  try {
    const { orderId } = req.params;
    const order = await getOrderById(orderId);

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/* ================= CONFIRM ================= */
export async function confirmOrder(req: Request, res: Response) {
  try {
    const { orderId } = req.params;
    const order = await updateOrderStatus(orderId, "CONFIRMED");
    res.json(order);
  } catch (error) {
    console.error("Error confirming order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/* ================= CANCEL ================= */
export async function cancelOrder(req: Request, res: Response) {
  try {
    const { orderId } = req.params;
    const order = await updateOrderStatus(orderId, "CANCELLED");
    res.json(order);
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
