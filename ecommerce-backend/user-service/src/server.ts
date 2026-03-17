import dotenv from "dotenv";
import app from "./app";
import { getUserProducer } from "./kafka/kafka.client";
import { startUserConsumer } from "./kafka/user.consumer";

dotenv.config();

async function start() {
  await getUserProducer();
  await startUserConsumer();

  const port = process.env.PORT || 3015;

  app.listen(port, () => {
    console.log(`👤 User Service running on port ${port}`);
  });
}

start().catch((err) => {
  console.error("❌ Failed to start user-service", err);
  process.exit(1);
});
