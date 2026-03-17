import { Kafka } from "kafkajs";
import { config } from "../config/config";

/**
 * ✅ Fallback safety (prevents "undefined broker" crash)
 */
const BROKER = config.KAFKA_BROKER || "localhost:9092";

if (!config.KAFKA_BROKER) {
  console.warn("⚠️ KAFKA_BROKER not found in env. Using default localhost:9092");
}

const kafka = new Kafka({
  clientId: config.KAFKA_CLIENT_ID || "refund-service",
  brokers: [BROKER],
});

/**
 * ✅ Producer & Consumer
 */
export const producer = kafka.producer();
export const consumer = kafka.consumer({
  groupId: "refund-group",
});

/**
 * ✅ Connect Kafka safely
 */
export const connectKafka = async () => {
  try {
    await producer.connect();
    console.log("✅ Kafka Producer connected");

    await consumer.connect();
    console.log("✅ Kafka Consumer connected");
  } catch (error) {
    console.error("❌ Kafka connection error:", error);
  }
};
