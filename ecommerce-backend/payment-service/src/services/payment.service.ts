import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createPaymentService(
  userId: string,
  orderId: string,
  amount: number,
  provider: string,
  currency: string
) {
  return prisma.payment.create({
    data: {
      userId,
      orderId,
      amount,
      provider,
      currency,
      status: "PENDING",
    },
  });
}

export async function getPaymentsByOrderService(orderId: string) {
  return prisma.payment.findMany({ where: { orderId } });
}

export async function updatePaymentStatus(
  paymentId: string,
  status: string,
  transactionId?: string
) {
  return prisma.payment.update({
    where: { id: paymentId },
    data: { status, transactionId },
  });
}

export async function refundPaymentService(orderId: string) {
  // Mark all payments for this order as refunded
  return prisma.payment.updateMany({
    where: { orderId },
    data: { status: "REFUNDED" },
  });
}

export async function getPaymentStatusService(orderId: string) {
  return prisma.payment.findFirst({
    where: { orderId },
    orderBy: { createdAt: "desc" },
  });
}

