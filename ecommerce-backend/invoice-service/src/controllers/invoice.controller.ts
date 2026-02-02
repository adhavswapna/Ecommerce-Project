import { Request, Response } from "express";
import * as invoiceService from "../services/invoice.service";

export async function createInvoice(req: Request, res: Response) {
  const { orderId, userId, amount } = req.body;

  const invoice = await invoiceService.createInvoice({
    orderId,
    userId,
    amount,
  });

  res.status(201).json(invoice);
}

export async function getInvoice(req: Request, res: Response) {
  const invoice = await invoiceService.getInvoiceById(req.params.id);

  if (!invoice) {
    return res.status(404).json({ message: "Invoice not found" });
  }

  res.json(invoice);
}

export async function listInvoices(req: Request, res: Response) {
  const invoices = await invoiceService.listInvoices();
  res.json(invoices);
}
