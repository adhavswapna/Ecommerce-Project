import dotenv from "dotenv";
import express from "express";
import orderRoutes from "./routes/order.routes";
import { startOrderConsumer } from "./kafka/order-consumer";
import { disconnectKafka } from "./kafka/kafka-client";

dotenv.config();

const app = express();

app.use(express.json());
app.use("/orders", orderRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "order-service" });
});

const PORT = Number(process.env.SERVICE_PORT) || 3006;

async function startServer() {
  await startOrderConsumer();

  app.listen(PORT, () => {
    console.log(`🚀 Order Service running on port ${PORT}`);
    console.log(`📡 Kafka consumer connected and listening to order topics`);
  });
}

startServer();

process.on("SIGINT", async () => {
  console.log("🛑 Shutting down order-service...");
  await disconnectKafka();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("🛑 Shutting down order-service...");
  await disconnectKafka();
  process.exit(0);
});

export default app;

