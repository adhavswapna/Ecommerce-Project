import { Kafka } from "kafkajs";

let kafka: Kafka;

export function getKafka() {
  if (!kafka) {
    kafka = new Kafka({
      clientId: "shipping-service",
      brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
    });
  }
  return kafka;
}

