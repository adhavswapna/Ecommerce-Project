import { getKafka } from "./kafka.client";
import { EMAIL_TOPICS } from "./email.topics";
import { sendEmail } from "./sendEmail";

export async function startEmailConsumer() {
  if (process.env.ENABLE_KAFKA !== "true") {
    console.log("⚠️ Kafka disabled for email-service");
    return;
  }

  const kafka = getKafka();

  const consumer = kafka.consumer({
    groupId: process.env.KAFKA_GROUP_ID || "email-service-group",
  });

  await consumer.connect();

  // ✅ Subscribe to user.registered with fromBeginning: true for testing
  await consumer.subscribe({
    topic: EMAIL_TOPICS.USER_REGISTERED,
    fromBeginning: true, // ensures we receive all previous events
  });

  console.log("📨 Email Kafka consumer started");

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      if (!message.value) return;

      try {
        const payload = JSON.parse(message.value.toString());

        switch (topic) {
          case EMAIL_TOPICS.USER_REGISTERED:
            console.log("📧 Sending welcome email to:", payload.email);
            await sendEmail(
              payload.email,
              "Welcome to E-Commerce 🎉",
              `Hi ${payload.name}, welcome to our platform!`
            );
            console.log("✅ Welcome email sent to:", payload.email);
            break;

          // Add more cases if you want to handle order/payment emails later
        }
      } catch (err) {
        console.error("❌ Failed to process Kafka message:", err);
      }
    },
  });
}

