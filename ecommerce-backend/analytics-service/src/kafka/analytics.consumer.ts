// src/kafka/analytics.consumer.ts

import { Consumer } from "kafkajs";
import { getKafka } from "./kafka-client";
import { ANALYTICS_TOPICS } from "./analytics.topics";
import { recordEvent } from "../services/analytics.service";

let consumer: Consumer | null = null;

export async function startAnalyticsConsumer() {
  if (process.env.ENABLE_KAFKA !== "true") {
    console.log("⚠️ Kafka disabled for analytics-service");
    return;
  }

  const kafka = getKafka();

  consumer = kafka.consumer({
    groupId: process.env.KAFKA_GROUP_ID || "analytics-group",
  });

  await consumer.connect();

  /* ================= USER EVENTS ================= */

  await consumer.subscribe({
    topic: ANALYTICS_TOPICS.USER_REGISTERED,
    fromBeginning: false,
  });

  /* ================= PRODUCT EVENTS ================= */

  await consumer.subscribe({
    topic: ANALYTICS_TOPICS.PRODUCT_CREATED,
    fromBeginning: false,
  });

  /* ================= ORDER EVENTS ================= */

  await consumer.subscribe({
    topic: ANALYTICS_TOPICS.ORDER_CREATED,
    fromBeginning: false,
  });

  /* ================= PAYMENT EVENTS ================= */

  await consumer.subscribe({
    topic: ANALYTICS_TOPICS.PAYMENT_SUCCESS,
    fromBeginning: false,
  });

  /* ================= CART EVENTS ================= */

  await consumer.subscribe({
    topic: ANALYTICS_TOPICS.CART_ITEM_ADDED,
    fromBeginning: false,
  });

  await consumer.subscribe({
    topic: ANALYTICS_TOPICS.CART_ITEM_REMOVED,
    fromBeginning: false,
  });

  await consumer.subscribe({
    topic: ANALYTICS_TOPICS.CART_CLEARED,
    fromBeginning: false,
  });

  console.log("📈 Analytics Kafka consumer started");

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      if (!message.value) return;

      try {
        const payload = JSON.parse(message.value.toString());

        console.log(`📊 Analytics event received → ${topic}`);

        await recordEvent(topic, payload);

        console.log("✅ Analytics event stored");
      } catch (error) {
        console.error("❌ Analytics consumer error:", error);
      }
    },
  });
}

export async function stopAnalyticsConsumer() {
  try {
    if (consumer) {
      await consumer.disconnect();
      console.log("🛑 Analytics Kafka consumer disconnected");
    }
  } catch (error) {
    console.error("❌ Error disconnecting analytics consumer:", error);
  }
}
