export const config = {
  PORT: process.env.PORT || 3016,
  DATABASE_URL: process.env.DATABASE_URL || "",
  KAFKA_BROKER: process.env.KAFKA_BROKER || "localhost:9092",
  REDIS_URL: process.env.REDIS_URL || "",

  // ✅ ADD THIS LINE
  KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID || "refund-service",
};
