// src/kafka.ts
import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "user-service",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: "user-service-group" });

export const connectKafka = async () => {
  await producer.connect();
  console.log("Kafka producer connected");
};

