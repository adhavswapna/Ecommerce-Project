import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: process.env.SERVICE_NAME!,
  brokers: [process.env.KAFKA_BROKER!],
});

export function getKafka() {
  return kafka;
}

