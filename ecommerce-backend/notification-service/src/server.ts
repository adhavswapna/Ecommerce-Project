// src/server.ts

import app from "./app";
import dotenv from "dotenv";
import { initWebSocket } from "./websocket/websocket";
import { startKafkaConsumer } from "./kafka/notification.consumer";
import { connectProducer } from "./kafka/notification.producer";

dotenv.config();

const PORT = process.env.PORT || 3018;

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Notification Service running on port ${PORT}`);
});

// WebSocket
initWebSocket(8080);

// Kafka
(async () => {
  try {
    await connectProducer();
    await startKafkaConsumer();
    console.log("📡 Kafka Ready");
  } catch (err) {
    console.error("❌ Kafka Error:", err);
  }
})();
