import dotenv from "dotenv";

dotenv.config();

export const config = {
  env: process.env.NODE_ENV!,
  serviceName: process.env.SERVICE_NAME!,
  port: Number(process.env.SERVICE_PORT),
  databaseUrl: process.env.DATABASE_URL!,
  kafkaBroker: process.env.KAFKA_BROKER!,
  kafkaClientId: process.env.KAFKA_CLIENT_ID!,
  kafkaGroupId: process.env.KAFKA_GROUP_ID!
};

