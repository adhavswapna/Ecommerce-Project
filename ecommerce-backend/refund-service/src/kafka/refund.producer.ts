import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || "refund-service",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
});

const producer = kafka.producer();

let isConnected = false;

/**
 * ✅ Ensure producer is connected before sending
 */
async function ensureConnection() {
  if (!isConnected) {
    await producer.connect();
    isConnected = true;
    console.log("✅ Kafka Producer Connected");
  }
}

export async function publishRefundCompleted(data: {
  orderId: string;
  refundId: string;
  amount: number;
  status: string;
}) {
  try {
    await ensureConnection(); // 🔥 FIX

    await producer.send({
      topic: "refund.completed",
      messages: [
        {
          value: JSON.stringify(data),
        },
      ],
    });

    console.log("📤 Refund Completed Event Sent:", data);
  } catch (error) {
    console.error("❌ Kafka Producer Error:", error);
  }
}
