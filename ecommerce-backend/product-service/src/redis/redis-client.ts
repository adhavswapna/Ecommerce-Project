import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
const serviceName = process.env.SERVICE_NAME || "PRODUCT_SERVICE";

export const redis = new Redis(redisUrl);

redis.on("connect", () =>
  console.log(`✅ Redis connected for ${serviceName}`)
);

redis.on("error", (err) =>
  console.error(`❌ Redis error in ${serviceName}:`, err)
);
