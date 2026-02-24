import { getConsumer } from "./kafka-client";

export async function consumeMessages(topic: string, groupId: string, callback: (msg: any) => void) {
  const consumer = await getConsumer(groupId);
  if (!consumer) return;

  await consumer.subscribe({ topic, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (message.value) {
        try {
          const parsed = JSON.parse(message.value.toString());
          callback(parsed);
        } catch (err) {
          console.error("Error parsing Kafka message:", err);
        }
      }
    },
  });
}

