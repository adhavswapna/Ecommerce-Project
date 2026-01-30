// filepath: src/controllers/order-controller.ts
import { Request, Response } from "express";
import { placeOrder, getOrders } from "../services/order.service";

export async function checkout(req: Request, res: Response) {
  try {
    const { userId, total } = req.body;

    if (!userId || total === undefined) {
      return res.status(400).json({
        message: "userId and total are required",
      });
    }

    const order = await placeOrder(userId, Number(total));
    return res.status(201).json(order);
  } catch (error) {
    console.error("Error in checkout:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function listOrders(req: Request, res: Response) {
  try {
    const userId = req.params.userId as string;

    const orders = await getOrders(userId);
    return res.status(200).json(orders);
  } catch (error) {
    console.error("Error listing orders:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
