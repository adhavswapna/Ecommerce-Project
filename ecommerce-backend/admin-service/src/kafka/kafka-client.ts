import { Kafka, Producer, Consumer } from "kafkajs";

const kafka = new Kafka({
  clientId: process.env.SERVICE_NAME || "admin-service",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
});

let producer: Producer | null = null;

export async function getProducer(): Promise<Producer | null> {
  if (process.env.ENABLE_KAFKA !== "true") return null;
  if (!producer) {
    producer = kafka.producer();
    await producer.connect();
    console.log("Kafka Producer connected ✅");
  }
  return producer;
}

export async function getConsumer(groupId: string): Promise<Consumer | null> {
  if (process.env.ENABLE_KAFKA !== "true") return null;
  const consumer = kafka.consumer({ groupId });
  await consumer.connect();
  console.log(`Kafka Consumer connected for group: ${groupId} ✅`);
  return consumer;
}

