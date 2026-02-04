import app from "./app";
import dotenv from "dotenv";
import { connectProducer } from "./kafka/vendor.producer";
import { connectConsumer } from "./kafka/vendor.consumer";

dotenv.config();

const PORT = process.env.PORT || 3011;

const startServer = async () => {
  try {
    // Connect Kafka producer & consumer
    await connectProducer();
    await connectConsumer();
    console.log("Kafka connected");

    // Start Express server
    app.listen(PORT, () => console.log(`Vendor service running on port ${PORT}`));
  } catch (err) {
    console.error("Error starting vendor service", err);
    process.exit(1);
  }
};

startServer();

