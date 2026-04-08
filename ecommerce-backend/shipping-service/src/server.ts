import express from "express";
import dotenv from "dotenv";
import shippingRoutes from "./routes/shipping.routes";
import { startShippingConsumer } from "./kafka/shipping.consumer";

dotenv.config();

const app = express();

app.use(express.json());

// ✅ Routes
app.use("/shipping", shippingRoutes);

// ✅ Health check
app.get("/health", (req, res) => {
  res.json({
    success: true,
    service: "shipping-service",
    status: "running",
  });
});

async function startServer() {
  try {
    console.log("🚚 Starting Shipping Service...");

    // Kafka consumer
    await startShippingConsumer();

    const PORT = process.env.PORT || 3014;

    app.listen(PORT, () => {
      console.log(`🚀 Shipping Service running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Shipping Service failed to start:", err);
    process.exit(1);
  }
}

startServer();
