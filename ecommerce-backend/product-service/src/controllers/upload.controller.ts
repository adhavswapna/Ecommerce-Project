import { Request, Response } from "express";
import { randomUUID } from "crypto";
import { uploadProductImage } from "../minio/minio-client";

export async function uploadImage(req: Request, res: Response) {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    // ❌ FIX: DO NOT prefix "products/"
    const fileName = `${randomUUID()}-${file.originalname}`;

    console.log("Uploading:", fileName);

    const url = await uploadProductImage(
      fileName,
      file.buffer,
      file.mimetype
    );

    return res.status(201).json({ url });
  } catch (error: any) {
    console.error("❌ MINIO ERROR:", error);

    return res.status(500).json({
      message: "Image upload failed",
      error: error.message,
    });
  }
}
