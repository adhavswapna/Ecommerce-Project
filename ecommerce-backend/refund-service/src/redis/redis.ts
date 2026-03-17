import Redis from "ioredis";
import { config } from "../config/config";

export const redisClient = new Redis(config.REDIS_URL);

redisClient.on("connect", () => {
  console.log("🟢 Redis connected (refund-service)");
});

redisClient.on("error", (err) => {
  console.error("🔴 Redis error:", err);
});
