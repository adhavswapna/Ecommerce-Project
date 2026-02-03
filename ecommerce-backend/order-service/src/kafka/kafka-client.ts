import { Kafka, Producer, Consumer } from "kafkajs";

const ENABLE_KAFKA = process.env.ENABLE_KAFKA === "true";

const kafka = new Kafka({
  clientId: process.env.SERVICE_NAME || "order-service",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
});

let producer: Producer | null = null;
let consumer: Consumer | null = null;

/* ================= PRODUCER ================= */
export async function getKafkaProducer(): Promise<Producer | null> {
  if (!ENABLE_KAFKA) return null;

  if (!producer) {
    producer = kafka.producer();
    await producer.connect();
    console.log("✅ Order Kafka Producer connected");
  }

  return producer;
}

/* ================= CONSUMER ================= */
export async function getKafkaConsumer(): Promise<Consumer | null> {
  if (!ENABLE_KAFKA) return null;

  if (!consumer) {
    consumer = kafka.consumer({
      groupId: process.env.KAFKA_GROUP_ID || "order-group",
    });

    await consumer.connect();
    console.log("✅ Order Kafka Consumer connected");
  }

  return consumer;
}

/* ================= SHUTDOWN ================= */
export async function disconnectKafka() {
  if (producer) await producer.disconnect();
  if (consumer) await consumer.disconnect();
  console.log("🔌 Order Kafka disconnected");
}

