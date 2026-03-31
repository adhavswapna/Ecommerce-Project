import { consumer } from "./kafka.client";
import { NOTIFICATION_TOPICS } from "./notification.topics";
import { broadcast } from "../websocket/websocket";

export const startKafkaConsumer = async () => {
  await consumer.connect();

  await consumer.subscribe({
    topics: Object.values(NOTIFICATION_TOPICS),
  });

  console.log("📡 Kafka Consumer Connected");

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const data = JSON.parse(message.value?.toString() || "{}");

      if (!data.userId) return;

      console.log(`📩 Event received: ${topic}`, data);

      switch (topic) {
        case NOTIFICATION_TOPICS.CART_UPDATED:
          broadcast({ userId: data.userId, cart: data.count });
          break;

        case NOTIFICATION_TOPICS.ORDER_CREATED:
          broadcast({ userId: data.userId, orders: 1, notifications: 1 });
          break;

        case NOTIFICATION_TOPICS.PAYMENT_FAILED:
          broadcast({ userId: data.userId, payments: 1, notifications: 1 });
          break;

        case NOTIFICATION_TOPICS.RETURN_REQUESTED:
          broadcast({ userId: data.userId, returns: 1 });
          break;
      }
    },
  });
};
