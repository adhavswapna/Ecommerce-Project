// filepath: src/services/order-service.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function placeOrder(userId: string, total: number) {
  return prisma.order.create({
    data: {
      userId,
      total,
      status: "PENDING",
    },
  });
}

export async function getOrders(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}
