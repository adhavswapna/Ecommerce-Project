import { getKafkaConsumer, getKafkaProducer } from "./kafka.client";
import {
  confirmOrderService,
  cancelOrderService,
} from "../services/order.service";

/* ---------------- Topics ---------------- */
const PAYMENT_TOPICS = {
  PAYMENT_SUCCESS: "payment.success",
  PAYMENT_FAILED: "payment.failed",
} as const;

export async function startOrderConsumer() {
  const consumer = await getKafkaConsumer();
  const producer = await getKafkaProducer();

  if (!consumer || !producer) {
    console.log("⚠️ Kafka disabled for order-service");
    return;
  }

  await consumer.subscribe({
    topic: PAYMENT_TOPICS.PAYMENT_SUCCESS,
    fromBeginning: false,
  });

  await consumer.subscribe({
    topic: PAYMENT_TOPICS.PAYMENT_FAILED,
    fromBeginning: false,
  });

  console.log("📥 Order Kafka consumer started");

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      if (!message.value) return;

      try {
        const payload = JSON.parse(message.value.toString());

        /* ================= PAYMENT SUCCESS ================= */
        if (topic === PAYMENT_TOPICS.PAYMENT_SUCCESS) {
          console.log("💳 Payment success received", payload);

          if (!payload?.orderId) {
            console.warn("⚠️ Missing orderId");
            return;
          }

          // 1. confirm order
          await confirmOrderService(payload.orderId);

          // 2. 🚀 TRIGGER INVOICE SERVICE
          await producer.send({
            topic: "invoice.requested",
            messages: [
              {
                value: JSON.stringify({
                  orderId: payload.orderId,
                  userId: payload.userId,
                  amount: payload.amount,
                }),
              },
            ],
          });

          console.log("📤 invoice.requested sent");
        }

        /* ================= PAYMENT FAILED ================= */
        if (topic === PAYMENT_TOPICS.PAYMENT_FAILED) {
          console.log("❌ Payment failed received", payload);

          if (!payload?.orderId) {
            console.warn("⚠️ Missing orderId");
            return;
          }

          await cancelOrderService(payload.orderId);
        }
      } catch (err) {
        console.error("❌ Order consumer error:", err);
      }
    },
  });
}
