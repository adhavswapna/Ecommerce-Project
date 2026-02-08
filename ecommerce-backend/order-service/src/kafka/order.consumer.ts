import { getKafkaConsumer } from "./kafka.client";
import { ORDER_TOPICS } from "./order.topics";

export async function startOrderConsumer() {
  const consumer = await getKafkaConsumer();
  if (!consumer) return;

  await consumer.subscribe({ topic: ORDER_TOPICS.CREATED });
  await consumer.subscribe({ topic: ORDER_TOPICS.CANCELLED });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      if (!message.value) return;

      const payload = JSON.parse(message.value.toString());
      console.log("📥 Order event received:", topic, payload);
    },
  });
}

