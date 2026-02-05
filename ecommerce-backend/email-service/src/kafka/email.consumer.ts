import { getKafka } from "./kafka-client";
import { EMAIL_TOPICS } from "./email.topics";
import { sendEmail } from "./sendEmail";

export async function startEmailConsumer() {
  if (process.env.ENABLE_KAFKA !== "true") {
    console.log("⚠️ Kafka disabled for email-service");
    return;
  }

  const kafka = getKafka();

  const consumer = kafka.consumer({
    groupId: process.env.KAFKA_GROUP_ID || "email-group",
  });

  await consumer.connect();

  await consumer.subscribe({ topic: EMAIL_TOPICS.USER_REGISTERED, fromBeginning: false });
  await consumer.subscribe({ topic: EMAIL_TOPICS.ORDER_CREATED, fromBeginning: false });
  await consumer.subscribe({ topic: EMAIL_TOPICS.PAYMENT_SUCCESS, fromBeginning: false });

  console.log("📨 Email Kafka consumer started");

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      if (!message.value) return;

      const payload = JSON.parse(message.value.toString());

      switch (topic) {
        case EMAIL_TOPICS.USER_REGISTERED:
          console.log("📧 Sending welcome email to:", payload.email);
          await sendEmail(
            payload.email,
            "Welcome to E-Commerce!",
            `Hi ${payload.name}, welcome to our platform! 🎉`
          );
          break;

        case EMAIL_TOPICS.ORDER_CREATED:
          console.log("📦 Sending order confirmation for:", payload.orderId);
          await sendEmail(
            payload.email,
            "Order Confirmation",
            `Your order ${payload.orderId} has been received!`
          );
          break;

        case EMAIL_TOPICS.PAYMENT_SUCCESS:
          console.log("💳 Sending payment success email for:", payload.orderId);
          await sendEmail(
            payload.email,
            "Payment Successful",
            `Your payment for order ${payload.orderId} was successful!`
          );
          break;
      }
    },
  });
}

