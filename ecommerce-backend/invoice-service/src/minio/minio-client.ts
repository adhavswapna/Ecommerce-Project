import { Client } from "minio";

export const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || "localhost",
  port: Number(process.env.MINIO_PORT) || 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY || "minio",   // ✅ FIXED
  secretKey: process.env.MINIO_SECRET_KEY || "minio123", // ✅ FIXED
});

export const BUCKET_NAME = "invoices";

/**
 * Initialize MinIO bucket
 */
export async function initMinio() {
  const exists = await minioClient.bucketExists(BUCKET_NAME);
  if (!exists) {
    await minioClient.makeBucket(BUCKET_NAME);
    console.log("🪣 MinIO bucket created:", BUCKET_NAME);
  } else {
    console.log("🪣 MinIO bucket exists:", BUCKET_NAME);
  }
}

/**
 * Upload PDF
 */
export async function uploadInvoicePDF(fileName: string, buffer: Buffer) {
  await minioClient.putObject(BUCKET_NAME, fileName, buffer, {
    "Content-Type": "application/pdf",
  });
  console.log(`✅ Invoice uploaded: ${fileName}`);
}

/**
 * 🔥 DOWNLOAD STREAM (NEW)
 */
export async function getInvoiceStream(fileName: string) {
  return minioClient.getObject(BUCKET_NAME, fileName);
}

/**
 * Pre-signed URL
 */
export async function getMinioPresignedUrl(objectName: string): Promise<string> {
  return minioClient.presignedGetObject(BUCKET_NAME, objectName, 60 * 60);
}
