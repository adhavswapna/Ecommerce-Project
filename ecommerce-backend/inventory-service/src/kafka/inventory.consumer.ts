import { Consumer } from "kafkajs";
import { getKafka } from "./kafka-client";
import { INVENTORY_TOPICS } from "./inventory.topics";
import { reduceStock, restoreStock } from "../services/inventory.service";

let consumer: Consumer | null = null;

export async function startInventoryConsumer() {
  if (process.env.ENABLE_KAFKA !== "true") {
    console.log("⚠️ Kafka disabled for inventory-service");
    return;
  }

  const kafka = getKafka();

  consumer = kafka.consumer({
    groupId: process.env.KAFKA_GROUP_ID || "inventory-service-group",
  });

  await consumer.connect();

  console.log("✅ Inventory Kafka consumer connected");

  await consumer.subscribe({
    topic: INVENTORY_TOPICS.ORDER_CREATED,
    fromBeginning: false,
  });

  await consumer.subscribe({
    topic: INVENTORY_TOPICS.ORDER_CANCELLED,
    fromBeginning: false,
  });

  console.log("📥 Inventory Kafka consumer subscribed");

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      if (!message.value) return;

      try {
        const payload = JSON.parse(message.value.toString());

        if (!payload.items || !Array.isArray(payload.items)) {
          console.warn("⚠️ Invalid inventory payload", payload);
          return;
        }

        switch (topic) {
          case INVENTORY_TOPICS.ORDER_CREATED:
            console.log("📦 ORDER_CREATED received", payload);

            for (const item of payload.items) {
              if (!item.productId || !item.quantity) continue;

              await reduceStock(item.productId, item.quantity);
            }

            console.log("📉 Stock reduced");
            break;

          case INVENTORY_TOPICS.ORDER_CANCELLED:
            console.log("♻️ ORDER_CANCELLED received", payload);

            for (const item of payload.items) {
              if (!item.productId || !item.quantity) continue;

              await restoreStock(item.productId, item.quantity);
            }

            console.log("📈 Stock restored");
            break;

          default:
            console.warn("⚠️ Unknown topic:", topic);
        }
      } catch (error) {
        console.error("❌ Inventory consumer error:", error);
      }
    },
  });
}

export async function stopInventoryConsumer() {
  if (consumer) {
    await consumer.disconnect();
    console.log("🛑 Inventory Kafka consumer disconnected");
  }
}
