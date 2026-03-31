import { Request, Response } from "express";
import {
  createInvoice,
  getInvoiceById,
  listInvoices,
} from "../services/invoice.service";

import { getMinioPresignedUrl } from "../minio/minio-client";

/**
 * GET /api/invoices
 */
export async function getAllInvoices(req: Request, res: Response) {
  const userId = (req as any).user?.id;

  const invoices = await listInvoices();

  // 🔐 filter only user invoices
  const userInvoices = invoices.filter((inv) => inv.userId === userId);

  res.json(userInvoices);
}

/**
 * GET /api/invoices/:id
 */
export async function getInvoice(req: Request, res: Response) {
  const { id } = req.params;
  const userId = (req as any).user?.id;

  const invoice = await getInvoiceById(id);

  if (!invoice) {
    return res.status(404).json({ message: "Invoice not found" });
  }

  // 🔐 AUTH CHECK
  if (invoice.userId !== userId) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  res.json(invoice);
}

/**
 * POST /api/invoices
 */
export async function createInvoiceController(req: Request, res: Response) {
  const { orderId, userId, fileUrl } = req.body;

  const invoice = await createInvoice({
    orderId,
    userId,
    fileUrl,
  });

  res.status(201).json(invoice);
}

/**
 * 🔗 SIGNED URL DOWNLOAD (BEST PRACTICE)
 */
export async function downloadInvoiceController(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;

    const invoice = await getInvoiceById(id);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // 🔐 AUTH CHECK
    if (invoice.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // 🔗 generate signed URL
    const url = await getMinioPresignedUrl(invoice.fileUrl);

    return res.json({
      downloadUrl: url,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Download failed" });
  }
}
