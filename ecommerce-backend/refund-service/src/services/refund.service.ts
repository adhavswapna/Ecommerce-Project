import { prisma } from "../db/prisma/prisma";
import { publishRefundCompleted } from "../kafka/refund.producer";

// ✅ Refund Status Enum
type RefundStatus =
  | "REQUESTED"
  | "APPROVED"
  | "REJECTED"
  | "PICKED_UP"
  | "COMPLETED";

interface RefundData {
  orderId: string;
  paymentId: string;
  userId: string;
  amount: number;
  reason: string;
}

export class RefundService {
  /**
   * Create refund (Kafka / manual trigger)
   */
  async processRefund(data: RefundData) {
    const { orderId, paymentId, userId, amount, reason } = data;

    // 1️⃣ Create refund
    const refund = await prisma.refund.create({
      data: {
        orderId,
        paymentId,
        userId,
        amount,
        reason,
        status: "REQUESTED",
      },
    });

    try {
      // 2️⃣ Simulate refund success (replace with Razorpay/Stripe later)
      const updatedRefund = await prisma.refund.update({
        where: { id: refund.id },
        data: { status: "COMPLETED" },
      });

      // 3️⃣ Kafka event
      await publishRefundCompleted({
        orderId: updatedRefund.orderId,
        refundId: updatedRefund.id,
        amount: updatedRefund.amount,
        status: updatedRefund.status,
      });

      return updatedRefund;
    } catch (error) {
      await prisma.refund.update({
        where: { id: refund.id },
        data: { status: "REJECTED" },
      });

      throw error;
    }
  }

  /**
   * Update refund status
   */
  async updateStatus(id: string, status: RefundStatus) {
    return prisma.refund.update({
      where: { id },
      data: { status },
    });
  }

  /**
   * Get refunds by order
   */
  async getRefundByOrder(orderId: string) {
    return prisma.refund.findMany({
      where: { orderId },
      orderBy: { createdAt: "desc" },
    });
  }
}
