import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { publishOrderCreated, publishOrderUpdated } from "../kafka/order-producer";
import { OrderCreatedEvent, OrderUpdatedEvent } from "../kafka/order-events";

// In-memory orders storage (replace with DB later)
const orders: Record<string, any> = {};

/* ================= Create Order ================= */
export async function createOrder(req: Request, res: Response) {
  const { userId, totalAmount } = req.body;

  if (!userId || !totalAmount) {
    return res.status(400).json({ message: "userId and totalAmount are required" });
  }

  const orderId = uuidv4();
  const newOrder = {
    orderId,
    userId,
    totalAmount,
    status: "CREATED",
    createdAt: new Date().toISOString(),
  };

  // Save order (replace with DB)
  orders[orderId] = newOrder;

  // Publish Kafka event
  const event: OrderCreatedEvent = newOrder;
  await publishOrderCreated(event);

  return res.status(201).json({ message: "Order created", order: newOrder });
}

/* ================= Update Order ================= */
export async function updateOrder(req: Request, res: Response) {
  const { orderId } = req.params;
  const { status } = req.body;

  if (!orders[orderId]) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (!status || !["CONFIRMED", "CANCELLED", "SHIPPED"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  orders[orderId].status = status;
  orders[orderId].updatedAt = new Date().toISOString();

  // Publish Kafka event
  const event: OrderUpdatedEvent = {
    orderId,
    status,
    updatedAt: orders[orderId].updatedAt,
  };
  await publishOrderUpdated(event);

  return res.status(200).json({ message: "Order updated", order: orders[orderId] });
}

/* ================= Get Orders ================= */
export function getOrders(_req: Request, res: Response) {
  return res.json(Object.values(orders));
}

