import { producer } from "./kafka.client";
import { REFUND_TOPICS } from "./refund.topics";

export const refundProducer = {
  /**
   * Emit when refund is successfully processed
   */
  async sendRefundCompleted(data: {
    orderId: string;
    refundId: string;
    amount: number;
    status: string;
  }) {
    try {
      await producer.connect();

      await producer.send({
        topic: REFUND_TOPICS.REFUND_COMPLETED,
        messages: [
          {
            value: JSON.stringify(data),
          },
        ],
      });

      console.log("📤 refund.completed published", data);
    } catch (error) {
      console.error("❌ Failed to publish refund.completed:", error);
    }
  },
};
