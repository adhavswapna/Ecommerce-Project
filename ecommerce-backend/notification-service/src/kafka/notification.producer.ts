// src/kafka/notification.producer.ts

import { Kafka, Partitioners } from "kafkajs";
import dotenv from "dotenv";

dotenv.config();

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || "notification-service",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
});

const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});

export const connectProducer = async () => {
  await producer.connect();
  console.log("🚀 Kafka Producer Connected");
};

export const sendNotificationEvent = async (
  topic: string,
  payload: any
) => {
  try {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(payload) }],
    });
  } catch (error) {
    console.error("❌ Kafka send error:", error);
  }
};
