import { Kafka } from "kafkajs";
import { config } from "../config/config";

export const kafka = new Kafka({
  clientId: config.kafkaClientId,
  brokers: [config.kafkaBroker]
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({
  groupId: config.kafkaGroupId
});
