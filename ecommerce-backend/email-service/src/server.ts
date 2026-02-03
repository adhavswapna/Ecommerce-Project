import express from "express";
import dotenv from "dotenv";
import emailRoutes from "./routes/email.routes";
import { startEmailConsumer } from "./kafka/email.consumer"; // ✅ Import consumer

dotenv.config();

const app = express();
app.use(express.json());

// email routes
app.use("/api/email", emailRoutes);

const PORT = process.env.SERVICE_PORT || 3006; // ✅ Use SERVICE_PORT from .env

const startServer = async () => {
  try {
    console.log("🚀 Starting Email Service...");

    // ✅ Start Kafka consumer
    await startEmailConsumer();

    app.listen(PORT, () => {
      console.log(`📧 Email service running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start Email Service", err);
    process.exit(1);
  }
};

startServer();

