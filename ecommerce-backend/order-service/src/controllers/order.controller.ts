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
    const {
      userId,
      totalAmount,
      currency,
      paymentMethod,
      address,
      items,
    } = req.body;

    if (
      !userId ||
      !totalAmount ||
      !paymentMethod ||
      !address ||
      !items
    ) {
      return res.status(400).json({
        message:
          "userId, totalAmount, paymentMethod, address and items are required",
      });
    }

    const order = await placeOrder(
      userId,
      totalAmount,
      currency,
      paymentMethod,
      address,
      items
    );

    return res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/* ================= GET MY ORDERS ================= */
export async function getMyOrders(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;

    const orders = await getOrders(userId);

    return res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/* ================= GET ORDER BY ID ================= */
export async function getOrderByIdController(req: Request, res: Response) {
  try {
    const { orderId } = req.params;

    const order = await getOrderById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/* ================= CONFIRM ORDER ================= */
export async function confirmOrder(req: Request, res: Response) {
  try {
    const { orderId } = req.params;

    const order = await updateOrderStatus(orderId, "CONFIRMED");

    return res.json(order);
  } catch (error) {
    console.error("Error confirming order:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/* ================= CANCEL ORDER ================= */
export async function cancelOrder(req: Request, res: Response) {
  try {
    const { orderId } = req.params;

    const order = await updateOrderStatus(orderId, "CANCELLED");

    return res.json(order);
  } catch (error) {
    console.error("Error cancelling order:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
