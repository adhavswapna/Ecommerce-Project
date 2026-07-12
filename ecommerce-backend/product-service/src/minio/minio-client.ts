import { Client } from "minio";

export const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || "localhost",
  port: Number(process.env.MINIO_PORT) || 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY || "minio",
  secretKey: process.env.MINIO_SECRET_KEY || "minio123",
});

// Bucket name
export const BUCKET_NAME = "products";

/**
 * Init bucket + public access
 */
export async function initMinio() {
  try {
    const exists = await minioClient.bucketExists(BUCKET_NAME);

    if (!exists) {
      await minioClient.makeBucket(BUCKET_NAME);
      console.log("🪣 Bucket created:", BUCKET_NAME);
    }

    const policy = {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: { AWS: ["*"] },
          Action: ["s3:GetObject"],
          Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`],
        },
      ],
    };

    await minioClient.setBucketPolicy(
      BUCKET_NAME,
      JSON.stringify(policy)
    );

    console.log("🌎 Public read enabled:", BUCKET_NAME);
  } catch (error) {
    console.error("MinIO init error:", error);
  }
}

/**
 * Upload image
 */
export async function uploadProductImage(
  fileName: string,
  buffer: Buffer,
  mimeType: string
) {
  await minioClient.putObject(BUCKET_NAME, fileName, buffer, {
    "Content-Type": mimeType,
  });

  console.log("✅ Uploaded:", fileName);

  return getProductImageUrl(fileName);
}

/**
 * Generate correct URL
 */
export function getProductImageUrl(fileName: string): string {
  const host = process.env.MINIO_ENDPOINT || "localhost";
  const port = process.env.MINIO_PORT || "9000";

  return `http://${host}:${port}/${BUCKET_NAME}/${fileName}`;
}
