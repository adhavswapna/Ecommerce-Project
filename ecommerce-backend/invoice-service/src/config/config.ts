// src/config/index.ts
import path from "path";
import dotenv from "dotenv";

// load .env from project root (outside src)
dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

export const config = {
  serviceName: process.env.SERVICE_NAME!,
  port: Number(process.env.SERVICE_PORT || 3010),

  kafka: {
    enabled: process.env.ENABLE_KAFKA === "true",
    broker: process.env.KAFKA_BROKER!,
    clientId: process.env.KAFKA_CLIENT_ID!,
    groupId: process.env.KAFKA_GROUP_ID!,
  },

  minio: {
    endPoint: process.env.MINIO_ENDPOINT || "localhost",
    port: Number(process.env.MINIO_PORT || 9000),
    accessKey: process.env.MINIO_ACCESS_KEY || "minioadmin",
    secretKey: process.env.MINIO_SECRET_KEY || "minioadmin",
    bucket: process.env.MINIO_BUCKET || "invoices",
    useSSL: process.env.MINIO_USE_SSL === "true",
  },
};

console.log("DEBUG ENABLE_KAFKA =", process.env.ENABLE_KAFKA);

