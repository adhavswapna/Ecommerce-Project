import { consumer } from "./kafka.client";
import { REFUND_TOPICS } from "./refund.topics";
import { RefundService } from "../services/refund.service";

const refundService = new RefundService();

export async function startRefundConsumer() {
  await consumer.connect();

  await consumer.subscribe({
    topic: REFUND_TOPICS.PAYMENT_REFUND_REQUESTED,
    fromBeginning: false,
  });

  console.log("💰 Refund consumer started");

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;

      const payload = JSON.parse(message.value.toString());

      console.log("💸 Refund request received:", payload);

      await refundService.processRefund(payload);
    },
  });
}
