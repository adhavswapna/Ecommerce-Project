import express from "express";
import dotenv from "dotenv";
import invoiceRoutes from "./routes/invoice.routes";
import { initMinio } from "./minio/minio-client";

dotenv.config();

const app = express();
app.use(express.json());

async function start() {
  console.log("🚀 Starting Invoice Service...");
  await initMinio();

  app.use("/invoice", invoiceRoutes);

  const port = process.env.SERVICE_PORT || 3010;
  app.listen(port, () =>
    console.log(`📄 Invoice service running on port ${port}`)
  );
}

start();

