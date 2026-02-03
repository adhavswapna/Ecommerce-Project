// src/kafka/invoice.consumer.ts
import { getKafkaConsumer } from "./kafka-client";

export async function startInvoiceConsumer() {
  const consumer = await getKafkaConsumer();
  if (!consumer) return;

  await consumer.subscribe({
    topic: "payment.completed",
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;
      const data = JSON.parse(message.value.toString());

      console.log("📥 payment.completed received", data);
    },
  });
}

