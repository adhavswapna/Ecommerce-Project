// src/kafka/inventory.consumer.ts
import { getKafka } from "./kafka-client";
import { INVENTORY_TOPICS } from "./inventory.topics";

export async function startInventoryConsumer() {
  if (process.env.ENABLE_KAFKA !== "true") {
    console.log("⚠️ Kafka disabled for inventory-service");
    return;
  }

  const kafka = getKafka();

  const consumer = kafka.consumer({
    groupId: process.env.KAFKA_GROUP_ID || "inventory-group",
  });

  await consumer.connect();

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

      const payload = JSON.parse(message.value.toString());

      if (topic === INVENTORY_TOPICS.ORDER_CREATED) {
        console.log("📦 Reduce stock for order:", payload.orderId);
      }

      if (topic === INVENTORY_TOPICS.ORDER_CANCELLED) {
        console.log("♻️ Restore stock for order:", payload.orderId);
      }
    },
  });
}
