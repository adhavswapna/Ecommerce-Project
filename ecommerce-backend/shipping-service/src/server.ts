import { app } from "./app";
import { config } from "./config/config";
import { producer } from "./kafka/kafka-client";
import { startShippingConsumer } from "./kafka/shipping.consumer";

const startServer = async () => {
  await producer.connect();
  await startShippingConsumer();

  app.listen(config.port, () => {
    console.log(`🚚 Shipping Service running on port ${config.port}`);
  });
};

startServer();
