import { getKafka } from "./kafka-client";
import { ANALYTICS_TOPICS } from "./analytics.topics";
import { recordEvent } from "../services/analytics.service";

export async function startAnalyticsConsumer() {
  if (process.env.ENABLE_KAFKA !== "true") {
    console.log("⚠️ Kafka disabled for analytics-service");
    return;
  }

  const kafka = getKafka();

  const consumer = kafka.consumer({
    groupId: process.env.KAFKA_GROUP_ID || "analytics-group",
  });

  await consumer.connect();

  await consumer.subscribe({ topic: ANALYTICS_TOPICS.USER_REGISTERED });
  await consumer.subscribe({ topic: ANALYTICS_TOPICS.ORDER_CREATED });
  await consumer.subscribe({ topic: ANALYTICS_TOPICS.PAYMENT_SUCCESS });

  console.log("📈 Analytics Kafka consumer started");

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      if (!message.value) return;

      const payload = JSON.parse(message.value.toString());

      await recordEvent(topic, payload);
    },
  });
}

