import dotenv from "dotenv";
import app from "./app";
import { disconnectKafka } from "./kafka/kafka.client";

dotenv.config();

const port = Number(process.env.SERVICE_PORT) || 3005;

app.listen(port, () => {
  console.log(`🚀 Cart Service running on port ${port}`);
});

process.on("SIGINT", async () => {
  console.log("Shutting down Cart Service...");
  await disconnectKafka();
  process.exit(0);
});
