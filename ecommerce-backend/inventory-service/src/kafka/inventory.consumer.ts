// src/kafka/inventory.consumer.ts
import { getKafka } from "./kafka-client";
import { INVENTORY_TOPICS } from "./inventory.topics";
import { Consumer } from "kafkajs";

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

  console.log("📥 Inventory Kafka consumer subscribed to topics");

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      if (!message.value) return;

      const payload = JSON.parse(message.value.toString());

      switch (topic) {
        case INVENTORY_TOPICS.ORDER_CREATED:
          console.log(
            `📦 ORDER_CREATED → Reduce stock | orderId=${payload.orderId}`
          );
          // TODO: reduce inventory stock here
          break;

        case INVENTORY_TOPICS.ORDER_CANCELLED:
          console.log(
            `♻️ ORDER_CANCELLED → Restore stock | orderId=${payload.orderId}`
          );
          // TODO: restore inventory stock here
          break;

        default:
          console.warn("⚠️ Unknown topic received:", topic);
      }
    },
  });
}

/**
 * Graceful shutdown
 */
export async function stopInventoryConsumer() {
  if (consumer) {
    await consumer.disconnect();
    console.log("🛑 Inventory Kafka consumer disconnected");
  }
}

