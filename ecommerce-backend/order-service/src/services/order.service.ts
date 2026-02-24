import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function placeOrder(
  userId: string,
  totalAmount: number,
  currency: string,
  paymentMethod: string,
  items: { productId: string; quantity: number; price: number }[]
) {
  return prisma.order.create({
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
}

export async function getOrders(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });
}

export async function getOrderById(orderId: string) {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
}

export async function updateOrderStatus(orderId: string, status: string) {
  return prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: { items: true },
  });
}

