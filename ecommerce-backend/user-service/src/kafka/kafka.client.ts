import { Kafka } from "kafkajs";

let kafka: Kafka;
let producer: any;
let consumer: any;

export function getKafka() {
  if (!kafka) {
    kafka = new Kafka({
      clientId: "user-service",
      brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
    });
  }
  return kafka;
}

export async function getUserProducer() {
  if (!producer) {
    producer = getKafka().producer();
    await producer.connect();
    console.log("✅ User Kafka producer connected");
  }

  return producer;
}

export async function getUserConsumer() {
  if (!consumer) {
    consumer = getKafka().consumer({
      groupId: "user-service-group",
    });

    await consumer.connect();
    console.log("✅ User Kafka consumer connected");
  }

  return consumer;
}
