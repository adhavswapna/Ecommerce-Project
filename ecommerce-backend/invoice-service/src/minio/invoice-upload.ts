import { minioClient, BUCKET_NAME } from "./minio-client";

export async function uploadInvoicePDF(
  fileName: string,
  buffer: Buffer
) {
  await minioClient.putObject(
    BUCKET_NAME,
    fileName,
    buffer,
    {
      "Content-Type": "application/pdf",
    }
  );

  console.log(`✅ Invoice uploaded to MinIO: ${fileName}`);
}

