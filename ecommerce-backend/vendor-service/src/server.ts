import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { connectProducer } from "./kafka/vendor.producer";
import { connectConsumer } from "./kafka/vendor.consumer";

const PORT = process.env.PORT || 3011;

const startServer = async () => {
  try {
    await connectProducer();
    await connectConsumer();
    console.log("Kafka connected");

    app.listen(PORT, () => console.log(`Vendor service running on port ${PORT}`));
  } catch (err) {
    console.error("Error starting vendor service", err);
    process.exit(1);
  }
};

startServer();

