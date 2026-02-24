import { Request, Response } from "express";
import {
  createInvoice,
  getInvoiceById,
  listInvoices,
} from "../services/invoice.service";

/**
 * GET /api/invoices
 */
export async function getAllInvoices(req: Request, res: Response) {
  const invoices = await listInvoices();
  res.json(invoices);
}

/**
 * GET /api/invoices/:id
 */
export async function getInvoice(req: Request, res: Response) {
  const { id } = req.params;

  const invoice = await getInvoiceById(id);
  if (!invoice) {
    return res.status(404).json({ message: "Invoice not found" });
  }

  res.json(invoice);
}

/**
 * POST /api/invoices
 */
export async function createInvoiceController(req: Request, res: Response) {
  const { orderId, userId, amount } = req.body;

  const invoice = await createInvoice({
    orderId,
    userId,
    amount,
  });

  res.status(201).json(invoice);
}

