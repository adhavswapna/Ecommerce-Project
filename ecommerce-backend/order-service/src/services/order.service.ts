import { PrismaClient } from "@prisma/client";
import { redis } from "../redis/redis-client";
import {
  publishOrderCreated,
  publishOrderCancelled,
} from "../kafka/order.producer";

const prisma = new PrismaClient();

const USER_ORDERS_CACHE = (userId: string) => `orders:user:${userId}`;

export async function placeOrder(
  userId: string,
  totalAmount: number,
  currency: string,
  paymentMethod: string,
  items: { productId: string; quantity: number; price: number }[]
) {
  const order = await prisma.order.create({
    data: {
      userId,
      totalAmount,
      currency,
      paymentMethod,
      status: "PENDING",
      items: {
        create: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
    include: { items: true },
  });

  await redis.del(USER_ORDERS_CACHE(userId));

  await publishOrderCreated({
    orderId: order.id,
    userId: order.userId,
    totalAmount: order.totalAmount,
    items: order.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    })),
  });

  return order;
}

export async function getOrders(userId: string) {
  const cacheKey = USER_ORDERS_CACHE(userId);

  const cached = await redis.get(cacheKey);

  if (cached) {
    console.log("⚡ Orders fetched from Redis");
    return JSON.parse(cached);
  }

  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  await redis.set(cacheKey, JSON.stringify(orders), "EX", 60);

  return orders;
}

export async function getOrderById(orderId: string) {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
}

export async function updateOrderStatus(orderId: string, status: string) {
  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: { items: true },
  });

  await redis.del(USER_ORDERS_CACHE(order.userId));

  if (status === "CANCELLED") {
    await publishOrderCancelled({
      orderId: order.id,
      userId: order.userId,
    });
  }

  return order;
}
