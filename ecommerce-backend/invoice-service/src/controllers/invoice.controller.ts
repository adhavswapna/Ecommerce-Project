import { Response } from "express";
import {
  getInvoiceById,
  listInvoices,
  generateAndStoreInvoice,
} from "../services/invoice.service";
import { getMinioPresignedUrl } from "../minio/minio-client";
import { AuthRequest } from "../middlewares/auth.middleware";

/**
 * GET /invoices
 */
export async function getAllInvoices(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const invoices = await listInvoices();

    const userInvoices = invoices.filter(
      (inv) => inv.userId === userId
    );

    return res.status(200).json({
      success: true,
      data: userInvoices,
    });
  } catch (err) {
    console.error("❌ getAllInvoices error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch invoices",
    });
  }
}

/**
 * GET /invoices/:id
 */
export async function getInvoice(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const invoice = await getInvoiceById(id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    if (invoice.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    return res.status(200).json({
      success: true,
      data: invoice,
    });
  } catch (err) {
    console.error("❌ getInvoice error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch invoice",
    });
  }
}

/**
 * POST /invoices
 * 🔥 Manual trigger (for testing only)
 */
export async function createInvoiceController(
  req: AuthRequest,
  res: Response
) {
  try {
    const { orderId, amount } = req.body;
    const userId = req.user?.id;

    // 🔐 Auth check
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // ✅ Validation
    if (!orderId || typeof orderId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Valid orderId is required",
      });
    }

    if (typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid amount is required",
      });
    }

    // 🔥 Generate invoice
    const invoice = await generateAndStoreInvoice({
      orderId,
      userId,
      amount,
    });

    return res.status(201).json({
      success: true,
      data: invoice,
    });
  } catch (err) {
    console.error("❌ Invoice creation failed:", err);

    return res.status(500).json({
      success: false,
      message: "Invoice creation failed",
    });
  }
}

/**
 * GET /invoices/:id/download
 */
export async function downloadInvoiceController(
  req: AuthRequest,
  res: Response
) {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const invoice = await getInvoiceById(id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    if (invoice.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    // 🔗 Generate secure download URL
    const downloadUrl = await getMinioPresignedUrl(
      invoice.fileUrl
    );

    return res.status(200).json({
      success: true,
      downloadUrl,
    });
  } catch (err) {
    console.error("❌ Download error:", err);

    return res.status(500).json({
      success: false,
      message: "Download failed",
    });
  }
}
