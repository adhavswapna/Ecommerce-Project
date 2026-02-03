import prisma from "../db/prisma/prisma";
import { PaymentStatus } from "@prisma/client";

export const createPaymentService = async (
  orderId: string,
  amount: number,
  provider: string
) => {
  return prisma.payment.create({
    data: {
      orderId,
      amount,
      provider,
      status: PaymentStatus.PENDING,
    },
  });
};

export const getPaymentsByOrderService = async (orderId: string) => {
  return prisma.payment.findMany({
    where: { orderId },
  });
};


