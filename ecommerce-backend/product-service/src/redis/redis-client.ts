import Redis from "ioredis";

const host = process.env.REDIS_HOST || "localhost";
const port = Number(process.env.REDIS_PORT || 6379);

const serviceName = process.env.SERVICE_NAME || "PRODUCT_SERVICE";

console.log("Redis config:", { host, port });

export const redis = new Redis({
  host,
  port,
  retryStrategy: (times) => {
    return Math.min(times * 200, 2000);
  },
});

redis.on("connect", () =>
  console.log(`✅ Redis connected for ${serviceName}`)
);

redis.on("error", (err) =>
  console.error(`❌ Redis error in ${serviceName}:`, err)
);
