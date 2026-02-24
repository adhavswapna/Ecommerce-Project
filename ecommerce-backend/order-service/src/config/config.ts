import dotenv from "dotenv";
dotenv.config();

export const config = {
  serviceName: process.env.SERVICE_NAME || "order-service",
  kafkaBroker: process.env.KAFKA_BROKER || "localhost:9092",
  kafkaGroupId: process.env.KAFKA_GROUP_ID || "order-group",
};

