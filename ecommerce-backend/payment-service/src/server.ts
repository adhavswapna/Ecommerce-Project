import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { startPaymentConsumer } from "./kafka/payment.consumer";

const PORT = process.env.SERVICE_PORT || 3007;

const startServer = async () => {
  try {
    console.log("🚀 Starting Payment Service...");

    await startPaymentConsumer();

    app.listen(PORT, () => {
      console.log(`💳 Payment Service running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start Payment Service", err);
    process.exit(1);
  }
};

startServer();

