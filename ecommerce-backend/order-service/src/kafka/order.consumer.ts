import { getKafkaConsumer } from "./kafka.client";
import {
  confirmOrderService,
  cancelOrderService,
} from "../services/order.service";

/* ---------------- Local copy of payment topics ---------------- */
const PAYMENT_TOPICS = {
  PAYMENT_SUCCESS: "payment.success",
  PAYMENT_FAILED: "payment.failed",
} as const;

export async function startOrderConsumer() {
  const consumer = await getKafkaConsumer();

  if (!consumer) {
    console.log("⚠️ Kafka disabled for order-service");
    return;
  }

  /* ---------------- Subscribe ---------------- */

  await consumer.subscribe({
    topic: PAYMENT_TOPICS.PAYMENT_SUCCESS,
    fromBeginning: false,
  });

  await consumer.subscribe({
    topic: PAYMENT_TOPICS.PAYMENT_FAILED,
    fromBeginning: false,
  });

  console.log("📥 Order Kafka consumer started");

  /* ---------------- Run Consumer ---------------- */

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      if (!message.value) return;

      try {
        const payload = JSON.parse(message.value.toString());

        switch (topic) {
          case PAYMENT_TOPICS.PAYMENT_SUCCESS:
            console.log("💳 Payment success received", payload);

            if (payload?.orderId) {
              await confirmOrderService(payload.orderId);
            } else {
              console.warn("⚠️ Missing orderId in payment.success");
            }

            break;

          case PAYMENT_TOPICS.PAYMENT_FAILED:
            console.log("❌ Payment failed received", payload);

            if (payload?.orderId) {
              await cancelOrderService(payload.orderId);
            } else {
              console.warn("⚠️ Missing orderId in payment.failed");
            }

            break;

          default:
            console.warn("⚠️ Unknown topic:", topic);
        }
      } catch (err) {
        console.error("❌ Order consumer error:", err);
      }
    },
  });
}
