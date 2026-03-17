import dotenv from "dotenv";
dotenv.config();

export const config = {
  PORT: process.env.PORT || 3016,
  DATABASE_URL: process.env.DATABASE_URL!,
  KAFKA_BROKER: process.env.KAFKA_BROKER!,
  REDIS_URL: process.env.REDIS_URL!,
};
