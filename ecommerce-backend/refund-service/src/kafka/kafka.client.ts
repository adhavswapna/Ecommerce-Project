import { Kafka } from "kafkajs";
import { config } from "../config/config";

const BROKER = config.KAFKA_BROKER || "localhost:9092";

if (!config.KAFKA_BROKER) {
  console.warn("⚠️ KAFKA_BROKER missing, using localhost:9092");
}

export const kafka = new Kafka({
  clientId: config.KAFKA_CLIENT_ID || "refund-service",
  brokers: [BROKER],
  retry: {
    retries: 10,
    initialRetryTime: 3000,
  },
});
