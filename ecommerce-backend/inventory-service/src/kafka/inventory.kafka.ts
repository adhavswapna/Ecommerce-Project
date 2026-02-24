// src/kafka/inventory.kafka.ts
import { Kafka } from "kafkajs";

export const inventoryKafka = new Kafka({
  clientId: "inventory-service",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
});
