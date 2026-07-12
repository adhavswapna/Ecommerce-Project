import Redis from "ioredis";

const host = process.env.REDIS_HOST || "localhost";
const port = Number(process.env.REDIS_PORT || 6379);

console.log("Redis config:", { host, port });

export const redis = new Redis({
  host,
  port,
});

redis.on("connect", () =>
  console.log(`✅ Redis connected for order-service`)
);

redis.on("error", (err) =>
  console.error("❌ Redis error:", err)
);
