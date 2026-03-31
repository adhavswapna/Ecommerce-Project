import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { initMinio } from "./minio/minio-client";
import { startInvoiceConsumer } from "./kafka/invoice.consumer";

async function start() {
  try {
    console.log("🚀 Starting Invoice Service...");

    await initMinio();

    if (process.env.ENABLE_KAFKA === "true") {
      await startInvoiceConsumer();
    }

    const port = process.env.PORT || 3010;

    app.listen(port, () => {
      console.log(`📄 Invoice service running on port ${port}`);
    });

  } catch (err) {
    console.error("❌ Invoice service failed to start", err);
    process.exit(1);
  }
}

start();
