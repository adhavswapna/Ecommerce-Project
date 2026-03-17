import { getKafkaConsumer } from "./kafka.client";

export async function startCartConsumer() {
  const consumer = await getKafkaConsumer();
  if (!consumer) return;

  console.log("📥 Cart Kafka consumer started");

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      if (!message.value) return;

      const payload = JSON.parse(message.value.toString());

      console.log("📥 Cart event received:", topic, payload);
    },
  });
}
