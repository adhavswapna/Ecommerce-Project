import { getKafkaConsumer } from "./kafka-client";
import { ORDER_TOPICS } from "./order-topics";
import {
  OrderCreatedEvent,
  OrderUpdatedEvent,
} from "./order-events";

export async function startOrderConsumer() {
  const consumer = await getKafkaConsumer();
  if (!consumer) return;

  await consumer.subscribe({
    topic: ORDER_TOPICS.CREATED,
    fromBeginning: true,
  });

  await consumer.subscribe({
    topic: ORDER_TOPICS.UPDATED,
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      if (!message.value) return;

      const payload = JSON.parse(message.value.toString());

      console.log(`📥 Order event received → ${topic}`, payload);

      switch (topic) {
        case ORDER_TOPICS.CREATED:
          const created: OrderCreatedEvent = payload;
          // handle order created
          break;

        case ORDER_TOPICS.UPDATED:
          const updated: OrderUpdatedEvent = payload;
          // handle order updated
          break;
      }
    },
  });
}

