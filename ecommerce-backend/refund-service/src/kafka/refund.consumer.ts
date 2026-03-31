import { kafka } from "./kafka.client";
import { RefundService } from "../services/refund.service";

const consumer = kafka.consumer({ groupId: "refund-group" });

const refundService = new RefundService();

export async function startRefundConsumer() {
  await consumer.connect();

  await consumer.subscribe({
    topic: "payment.refund.requested",
    fromBeginning: false,
  });

  console.log("✅ Refund Consumer Started");

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;

      const data = JSON.parse(message.value.toString());

      console.log("📥 Refund Request:", data);

      await refundService.processRefund(data);
    },
  });
}
