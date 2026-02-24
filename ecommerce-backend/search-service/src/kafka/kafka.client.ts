// src/kafka/kafka-client.ts

import { Kafka, Producer, Consumer } from "kafkajs";

const kafka = new Kafka({
  clientId: process.env.SERVICE_NAME || "search-service",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
});

let producer: Producer | null = null;
let consumer: Consumer | null = null;

export async function getKafkaProducer(): Promise<Producer> {
  if (!producer) {
    producer = kafka.producer();
    await producer.connect();
    console.log("✅ Kafka Producer connected (search-service)");
  }
  return producer;
}

export async function getKafkaConsumer(groupId: string): Promise<Consumer> {
  if (!consumer) {
    consumer = kafka.consumer({ groupId });
    await consumer.connect();
    console.log("✅ Kafka Consumer connected (search-service)");
  }
  return consumer;
}

