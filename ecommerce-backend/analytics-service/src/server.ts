import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { startAnalyticsConsumer } from "./kafka/analytics.consumer";

const PORT = process.env.SERVICE_PORT || 3011;

const startServer = async () => {
  try {
    console.log("🚀 Starting Analytics Service...");

    await startAnalyticsConsumer();

    app.listen(PORT, () => {
      console.log(`📊 Analytics Service running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start Analytics Service", err);
    process.exit(1);
  }
};

startServer();

