// src/kafka/payment.consumer.ts

import { getKafkaConsumer } from "./kafka-client";
import { PAYMENT_TOPICS } from "./payment.topics";
import { OrderCreatedEvent } from "./payment.events";
import {
  publishPaymentSuccess,
  publishPaymentFailed,
} from "./payment.producer";

export async function startPaymentConsumer() {
  const consumer = await getKafkaConsumer();
  if (!consumer) {
    console.log("⚠️ Kafka disabled for payment-service");
    return;
  }

  await consumer.subscribe({
    topic: PAYMENT_TOPICS.ORDER_CREATED,
    fromBeginning: false,
  });

  console.log("💳 Payment Kafka consumer started");

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      if (!message.value) return;

      let payload: OrderCreatedEvent;

      try {
        payload = JSON.parse(message.value.toString());
      } catch (error) {
        console.error("❌ Invalid Kafka payload:", error);
        return;
      }

      console.log(`💰 Payment processing for order: ${payload.orderId}`);

      try {
        /*
          In production this would call:
          - Stripe
          - Razorpay
          - PayPal
        */

        const paymentId = "pay_" + Date.now();

        await publishPaymentSuccess({
          orderId: payload.orderId,
          paymentId,
          amount: payload.totalAmount,
          userEmail: payload.userEmail,
          completedAt: new Date().toISOString(),
        });

        console.log(`✅ Payment success for order ${payload.orderId}`);

      } catch (error) {
        console.error(`❌ Payment failed for order ${payload.orderId}`);

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
