import express from "express";
import dotenv from "dotenv";
import invoiceRoutes from "./routes/invoice.routes";
import { initMinio } from "./minio/minio-client";
import { startInvoiceConsumer } from "./kafka/invoice.consumer";

dotenv.config();

const app = express();
app.use(express.json());

async function start() {
  console.log("🚀 Starting Invoice Service...");

  await initMinio();

  // ✅ START KAFKA CONSUMER
  if (process.env.ENABLE_KAFKA === "true") {
    await startInvoiceConsumer();
  } else {
    console.log("⚠️ Kafka disabled for invoice-service");
  }

  app.use("/invoice", invoiceRoutes);

  const port = process.env.SERVICE_PORT || 3010;
  app.listen(port, () =>
    console.log(`📄 Invoice service running on port ${port}`)
  );
}

start().catch((err) => {
  console.error("❌ Invoice service failed to start", err);
  process.exit(1);
});

