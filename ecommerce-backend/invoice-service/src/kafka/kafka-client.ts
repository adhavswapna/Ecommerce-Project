// src/kafka/kafka-client.ts
import { Kafka } from "kafkajs";
import { config } from "../config/config";

const kafka = new Kafka({
  clientId: config.kafka.clientId,
  brokers: [config.kafka.broker],
});

export async function getKafkaConsumer() {
  if (!config.kafka.enabled) {
    console.log("⚠️ Kafka disabled for invoice-service");
    return null;
  }

  const consumer = kafka.consumer({ groupId: config.kafka.groupId });
  await consumer.connect();
  console.log("✅ Kafka consumer connected");
  return consumer;
}

export async function getKafkaProducer() {
  if (!config.kafka.enabled) {
    console.log("⚠️ Kafka disabled for invoice-service");
    return null;
  }

  const producer = kafka.producer();
  await producer.connect();
  console.log("✅ Kafka producer connected");
  return producer;
}

