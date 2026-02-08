import express from "express";
import { startOrderConsumer } from "./kafka/order.consumer";
import { disconnectKafka } from "./kafka/kafka.client";

const app = express();
app.use(express.json());

async function start() {
  await startOrderConsumer();

  app.listen(3003, () => {
    console.log("🚀 Order Service running on port 3003");
  });
}

start();

process.on("SIGINT", async () => {
  await disconnectKafka();
  process.exit(0);
});

