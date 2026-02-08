// src/kafka/kafka-client.ts
import { Kafka, Producer, Consumer } from "kafkajs";
import { config } from "../config/config";

const kafka = new Kafka({
  clientId: config.kafka.clientId,
  brokers: [config.kafka.broker],
});

let producer: Producer | null = null;
let consumer: Consumer | null = null;

export async function getKafkaConsumer(): Promise<Consumer | null> {
  if (!config.kafka.enabled) {
    console.log("⚠️ Kafka disabled for invoice-service");
    return null;
  }

  if (!consumer) {
    consumer = kafka.consumer({ groupId: config.kafka.groupId });
    await consumer.connect();
    console.log("✅ Invoice Kafka consumer connected");
  }

  return consumer;
}

export async function getKafkaProducer(): Promise<Producer | null> {
  if (!config.kafka.enabled) {
    console.log("⚠️ Kafka disabled for invoice-service");
    return null;
  }

  if (!producer) {
    producer = kafka.producer();
    await producer.connect();
    console.log("✅ Invoice Kafka producer connected");
  }

  return producer;
}

