// src/minio/minio-client.ts
import * as Minio from "minio";
import { config } from "../config/config";

export const minioClient = new Minio.Client({
  endPoint: config.minio.endPoint,
  port: config.minio.port,
  useSSL: config.minio.useSSL,
  accessKey: config.minio.accessKey,
  secretKey: config.minio.secretKey,
});

export async function initMinio() {
  try {
    const exists = await minioClient.bucketExists(config.minio.bucket);

    if (!exists) {
      await minioClient.makeBucket(config.minio.bucket, "us-east-1");
      console.log(`🪣 MinIO bucket created: ${config.minio.bucket}`);
    } else {
      console.log(`🪣 MinIO bucket exists: ${config.minio.bucket}`);
    }

    console.log("✅ MinIO initialized");
  } catch (err) {
    console.error("❌ MinIO init failed", err);
    throw err;
  }
}

export async function uploadPdf(key: string, buffer: Buffer) {
  await minioClient.putObject(config.minio.bucket, key, buffer);
  console.log(`📄 PDF uploaded → ${key}`);
}

export async function getInvoiceUrl(key: string) {
  return minioClient.presignedGetObject(config.minio.bucket, key, 3600);
}

