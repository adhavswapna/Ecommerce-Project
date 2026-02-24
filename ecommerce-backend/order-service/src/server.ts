// server.ts — fixed
import 'dotenv/config'; // ✅ Load .env first
import app from "./app";
import { startOrderConsumer } from "./kafka/order.consumer";
import { disconnectKafka } from "./kafka/kafka.client";

const PORT = Number(process.env.SERVICE_PORT) || 3006;

async function start() {
  try {
    console.log("🚀 Starting Order Service...");

    // ✅ Kafka should NOT crash server
    try {
      await startOrderConsumer();
      console.log("✅ Kafka consumer started");
    } catch (err) {
      console.warn("⚠️ Kafka consumer failed, running without Kafka");
    }

    app.listen(PORT, () => {
      console.log(`🚀 Order Service running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start Order Service:", err);
  }
}

process.on("SIGINT", async () => {
  console.log("Shutting down Order Service...");
  await disconnectKafka();
  process.exit(0);
});

start();
