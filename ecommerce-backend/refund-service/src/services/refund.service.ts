import { prisma } from "../db/prisma/prisma";
import { publishRefundCompleted } from "../kafka/refund.producer";

export class RefundService {
  /**
   * Called by Kafka consumer (payment.refund.requested)
   */
  async processRefund(data: {
    orderId: string;
    paymentId: string;
    amount: number;
    reason: string;
  }) {
    // 1️⃣ Create refund entry
    const refund = await prisma.refund.create({
      data: {
        orderId: data.orderId,
        paymentId: data.paymentId,
        amount: data.amount,
        reason: data.reason,
        status: "PROCESSING",
      },
    });

    try {
      // 2️⃣ Simulate refund success (later: Razorpay/Stripe)
      const updatedRefund = await prisma.refund.update({
        where: { id: refund.id },
        data: { status: "SUCCESS" },
      });

      // 3️⃣ Emit event
      await publishRefundCompleted({
        orderId: updatedRefund.orderId,
        refundId: updatedRefund.id,
        amount: updatedRefund.amount,
        status: "SUCCESS",
      });

      return updatedRefund;
    } catch (error) {
      // 4️⃣ Handle failure
      await prisma.refund.update({
        where: { id: refund.id },
        data: { status: "FAILED" },
      });

      throw error;
    }
  }

  /**
   * Optional manual admin update
   */
  async updateStatus(id: string, status: string) {
    return prisma.refund.update({
      where: { id },
      data: { status },
    });
  }

  /**
   * Fetch refund
   */
  async getRefundByOrder(orderId: string) {
    return prisma.refund.findMany({
      where: { orderId },
      orderBy: { createdAt: "desc" },
    });
  }
}
