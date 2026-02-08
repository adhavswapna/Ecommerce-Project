// src/kafka/vendor.producer.ts
import { Kafka } from "kafkajs";
import { VENDOR_TOPICS } from "./vendor.topics";

let producerInstance: any;

// This function now matches the import in server.ts
export async function connectProducer() {
  if (!producerInstance) {
    const kafka = new Kafka({
      clientId: "vendor-service",
      brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
    });
    producerInstance = kafka.producer();
    await producerInstance.connect();
    console.log("✅ Vendor Kafka Producer connected");
  }
  return producerInstance;
}

// Internal helper for publishing messages
async function publish(topic: string, payload: any) {
  const producer = await connectProducer();
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(payload) }],
  });
  console.log(`📤 ${topic} event published`, payload);
}

// Exported functions for sending domain events
export async function publishVendorCreated(payload: any) {
  await publish(VENDOR_TOPICS.VENDOR_CREATED, payload);
}

export async function publishVendorStatusUpdated(payload: any) {
  await publish(VENDOR_TOPICS.VENDOR_STATUS_UPDATED, payload);
}

export async function publishProductPurchased(payload: any) {
  await publish(VENDOR_TOPICS.PRODUCT_PURCHASED, payload);
}

