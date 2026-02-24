// src/server.ts
import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { startInventoryConsumer } from "./kafka/inventory.consumer";

const PORT = process.env.SERVICE_PORT || 3009;

const startServer = async () => {
  try {
    // 🔥 Start Kafka consumer
    await startInventoryConsumer();
    console.log("✅ Inventory Kafka consumer started");

    // 🚀 Start HTTP server
    app.listen(PORT, () => {
      console.log(`📦 Inventory Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start Inventory Service", error);
    process.exit(1);
  }
};

startServer();

