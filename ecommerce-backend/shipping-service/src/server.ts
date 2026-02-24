import express from "express";
import dotenv from "dotenv";
import { startShippingConsumer } from "./kafka/shipping.consumer";

dotenv.config();

const app = express();
app.use(express.json());

async function startServer() {
  try {
    await startShippingConsumer();

    const PORT = process.env.PORT || 3009;
    app.listen(PORT, () => {
      console.log(`🚚 Shipping Service running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Shipping Service failed", err);
    process.exit(1);
  }
}

startServer();

