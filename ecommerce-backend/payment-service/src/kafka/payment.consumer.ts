import { getKafka } from "./kafka-client";
import { PAYMENT_TOPICS } from "./payment.topics";

export async function startPaymentConsumer() {
  if (process.env.ENABLE_KAFKA !== "true") {
    console.log("⚠️ Kafka disabled for payment-service");
    return;
  }

  const kafka = getKafka();

  const consumer = kafka.consumer({
    groupId: process.env.KAFKA_GROUP_ID || "payment-group",
  });

  await consumer.connect();

  await consumer.subscribe({
    topic: PAYMENT_TOPICS.ORDER_CREATED,
    fromBeginning: false,
  });

  console.log("💳 Payment Kafka consumer started");

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      if (!message.value) return;

      const payload = JSON.parse(message.value.toString());

      if (topic === PAYMENT_TOPICS.ORDER_CREATED) {
        console.log("💰 Processing payment for order:", payload.orderId);

        // Later:
        // - call Stripe
        // - emit payment.success or payment.failed
      }
    },
  });
}

