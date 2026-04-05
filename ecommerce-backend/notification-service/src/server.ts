import app from "./app";
import dotenv from "dotenv";
import { initWebSocket } from "./websocket/websocket";
import { startKafkaConsumer } from "./kafka/notification.consumer";

dotenv.config();

const PORT = process.env.PORT || 3018;

// 🚀 Start HTTP server
app.listen(PORT, () => {
  console.log(`🚀 Notification Service running on port ${PORT}`);
});

// 🔌 WebSocket server
initWebSocket(8080);

// 📡 Kafka consumer only
(async () => {
  try {
    await startKafkaConsumer();
    console.log("📡 Kafka Consumer Ready");
  } catch (err) {
    console.error("❌ Kafka Error:", err);
  }
})();
