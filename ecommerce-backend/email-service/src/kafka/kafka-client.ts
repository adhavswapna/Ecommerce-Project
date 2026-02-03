import { Kafka, Producer } from "kafkajs";

const kafka = new Kafka({
  clientId: process.env.SERVICE_NAME!,
  brokers: [process.env.KAFKA_BROKER!],
});

let producer: Producer | null = null;

export async function getProducer(): Promise<Producer | null> {
  if (process.env.ENABLE_KAFKA !== "true") return null;

  if (!producer) {
    producer = kafka.producer();
    await producer.connect();
    console.log("✅ Email Kafka producer connected");
  }

  return producer;
}

export function getKafka() {
  return kafka;
}

