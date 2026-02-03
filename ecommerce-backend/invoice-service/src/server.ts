// src/server.ts
import app from "./app";
import { config } from "./config/config";
import { startInvoiceConsumer } from "./kafka/invoice.consumer";
import { initMinio } from "./minio/minio-client";

async function startServer() {
  try {
    console.log("🚀 Starting Invoice Service...");

    // MinIO
    await initMinio();

    // Kafka
    if (config.kafka.enabled) {
      await startInvoiceConsumer();
      console.log("📡 Kafka consumers started");
    } else {
      console.log("⚠️ Kafka disabled for invoice-service");
    }

    app.listen(config.port, () => {
      console.log(`📄 Invoice service running on port ${config.port}`);
    });
  } catch (err) {
    console.error("❌ Failed to start Invoice Service", err);
    process.exit(1);
  }
}

startServer();

