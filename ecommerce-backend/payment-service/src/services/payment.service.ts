import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ CREATE PAYMENT
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

// ✅ GET PAYMENTS BY ORDER
export async function getPaymentsByOrderService(orderId: string) {
  return prisma.payment.findMany({
    where: { orderId },
    orderBy: { createdAt: "desc" },
  });
}

// ✅ NEW: GET PAYMENTS BY USER
export async function getPaymentsByUserService(userId: string) {
  return prisma.payment.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

// ✅ UPDATE PAYMENT STATUS
export async function updatePaymentStatus(
  paymentId: string,
  status: string,
  transactionId?: string
) {
  return prisma.payment.update({
    where: { id: paymentId },
    data: {
      status,
      transactionId,
    },
  });
}

// ✅ REFUND
export async function refundPaymentService(orderId: string) {
  return prisma.payment.updateMany({
    where: { orderId },
    data: { status: "REFUNDED" },
  });
}

// ✅ GET LATEST PAYMENT STATUS
export async function getPaymentStatusService(orderId: string) {
  return prisma.payment.findFirst({
    where: { orderId },
    orderBy: { createdAt: "desc" },
  });
}
