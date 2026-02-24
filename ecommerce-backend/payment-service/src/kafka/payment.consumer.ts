import { getKafkaConsumer } from "./kafka-client";
import { PAYMENT_TOPICS } from "./payment.topics";
import { OrderCreatedEvent } from "./payment.events";
import {
  publishPaymentSuccess,
  publishPaymentFailed,
} from "./payment.producer";

export async function startPaymentConsumer() {
  const consumer = await getKafkaConsumer();
  if (!consumer) return;

  await consumer.subscribe({
    topic: PAYMENT_TOPICS.ORDER_CREATED,
    fromBeginning: false,
  });

  console.log("💳 Payment Kafka consumer started");

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;

      const payload: OrderCreatedEvent = JSON.parse(
        message.value.toString()
      );

      console.log("💰 Processing payment for order:", payload.orderId);

      try {
        // 🔮 Later integrate Stripe / Razorpay here
        await publishPaymentSuccess({
          orderId: payload.orderId,
          paymentId: "pay_" + Date.now(),
          amount: payload.totalAmount,
          userEmail: payload.userEmail,
          completedAt: new Date().toISOString(),
        });
      } catch (err) {
        await publishPaymentFailed({
          orderId: payload.orderId,
          reason: "PAYMENT_FAILED",
          userEmail: payload.userEmail,
          failedAt: new Date().toISOString(),
        });
      }
    },
  });
}

