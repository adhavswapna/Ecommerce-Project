import { Kafka } from "kafkajs";

const broker = process.env.KAFKA_BROKER;
if (!broker) throw new Error("KAFKA_BROKER is not defined in .env");

export const kafka = new Kafka({
  clientId: "vendor-service",
  brokers: [broker],
});

