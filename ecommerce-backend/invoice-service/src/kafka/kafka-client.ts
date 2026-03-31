// src/kafka/kafka-client.ts
import { Kafka, Producer, Consumer, Partitioners } from "kafkajs";
import { config } from "../config/config";

const kafka = new Kafka({
  clientId: config.kafka.clientId || "invoice-service",
  brokers: [config.kafka.broker || "localhost:9092"],
});

let producer: Producer | null = null;
let consumer: Consumer | null = null;

/* ================= CONSUMER ================= */
export async function getKafkaConsumer(): Promise<Consumer | null> {
  if (!config.kafka.enabled) return null;

  if (consumer) return consumer;

  const groupId =
    config.kafka.groupId?.trim() || "invoice-service-group";

  consumer = kafka.consumer({ groupId });

  await consumer.connect();
  console.log(`✅ Invoice Kafka consumer connected (group: ${groupId})`);

  return consumer;
}

/* ================= PRODUCER ================= */
export async function getKafkaProducer(): Promise<Producer | null> {
  if (!config.kafka.enabled) return null;

  if (producer) return producer;

  producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner,
  });

  await producer.connect();
  console.log("✅ Invoice Kafka producer connected");

  return producer;
}
