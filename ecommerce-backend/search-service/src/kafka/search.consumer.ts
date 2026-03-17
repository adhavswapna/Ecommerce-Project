import { kafka } from "./kafka-client";
import { KAFKA_TOPICS } from "./topics";

let consumer: any;

export async function startSearchConsumer() {
  consumer = kafka.consumer({
    groupId: process.env.KAFKA_GROUP_ID || "search-group",
  });

  await consumer.connect();

  await consumer.subscribe({
    topic: KAFKA_TOPICS.PRODUCT_CREATED,
    fromBeginning: false,
  });

  await consumer.subscribe({
    topic: KAFKA_TOPICS.PRODUCT_UPDATED,
    fromBeginning: false,
  });

  await consumer.subscribe({
    topic: KAFKA_TOPICS.PRODUCT_DELETED,
    fromBeginning: false,
  });

  console.log("🔎 Search Kafka consumer started");

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      if (!message.value) return;

      try {
        const payload = JSON.parse(message.value.toString());

        switch (topic) {
          case KAFKA_TOPICS.PRODUCT_CREATED:
            console.log("📥 Index new product:", payload);
            break;

          case KAFKA_TOPICS.PRODUCT_UPDATED:
            console.log("🔄 Update product index:", payload);
            break;

          case KAFKA_TOPICS.PRODUCT_DELETED:
            console.log("🗑 Remove product from index:", payload);
            break;

          default:
            console.warn("⚠️ Unknown search topic:", topic);
        }
      } catch (error) {
        console.error("❌ Search consumer error:", error);
      }
    },
  });
}

export async function stopSearchConsumer() {
  if (consumer) {
    await consumer.disconnect();
    console.log("🛑 Search Kafka consumer disconnected");
  }
}
