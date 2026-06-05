// src/kafka/product-consumer.ts

import { consumer } from "./kafka";
import { PRODUCT_TOPICS } from "./product.topics";

export const startProductConsumer = async () => {
  await consumer.connect();

  console.log("📥 Product consumer connected");

  await consumer.subscribe({
    topic: PRODUCT_TOPICS.PRODUCT_STOCK_UPDATED,
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const value = message.value?.toString();

      if (!value) return;

      const data = JSON.parse(value);

      console.log(`📩 Event received from ${topic}`, data);

      if (topic === PRODUCT_TOPICS.PRODUCT_STOCK_UPDATED) {
        console.log("Stock updated:", data);
      }
    },
  });
};
