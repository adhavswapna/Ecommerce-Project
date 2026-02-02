import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.SERVICE_PORT || 3000,
  serviceName: process.env.SERVICE_NAME || "ADMIN_SERVICE",
  databaseUrl: process.env.DATABASE_URL!,
  kafkaBroker: process.env.KAFKA_BROKER!,
  enableKafka: process.env.ENABLE_KAFKA === "true",
  redisHost: process.env.REDIS_HOST!,
  redisPort: parseInt(process.env.REDIS_PORT || "6379"),
  redisTTL: parseInt(process.env.REDIS_TTL || "300"),
  jwtSecret: process.env.JWT_SECRET!
};

