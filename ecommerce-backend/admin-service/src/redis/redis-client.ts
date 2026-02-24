import Redis from "ioredis";
import { config } from "../config";

export const redisClient = new Redis({
  host: config.redisHost,
  port: config.redisPort
});

redisClient.on("connect", () => console.log("Redis connected"));
redisClient.on("error", (err) => console.error("Redis error:", err));

