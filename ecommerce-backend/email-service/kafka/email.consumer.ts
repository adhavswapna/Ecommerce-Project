import { Kafka } from "kafkajs";
import { sendEmail } from "../services/email.service";

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID!,
  brokers: [process.env.KAFKA_BROKER!],
});

const consumer = kafka.consumer({
  groupId: process.env.KAFKA_GROUP_ID!,
});

export async function startEmailConsumer() {
  if (process.env.ENABLE_KAFKA !== "true") return;

  await consumer.connect();
  await consumer.subscribe({
    topic: "email.send",
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;

      const payload = JSON.parse(message.value.toString());

      await sendEmail({
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
      });

      console.log("📧 Email sent to:", payload.to);
    },
  });
}
