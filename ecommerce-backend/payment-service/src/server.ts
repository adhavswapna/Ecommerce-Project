// src/server.ts

import "dotenv/config";
import app from "./app";
import { startPaymentConsumer } from "./kafka/payment.consumer";

const PORT = process.env.PORT || 3007;

async function startServer() {
  try {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Payment Service running on port ${PORT}`);
    });

    // Start Kafka consumer
    await startPaymentConsumer();

  } catch (error) {
    console.error("❌ Failed to start Payment Service:", error);
    process.exit(1);
  }
}

startServer();
