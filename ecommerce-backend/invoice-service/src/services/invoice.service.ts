// src/services/invoice.service.ts
import prisma from "../../db/prisma/prisma";

/**
 * Create a new invoice
 * NOTE:
 * - amount is NOT stored in DB (schema doesn't have it)
 * - fileUrl is REQUIRED, so we give a placeholder
 */
export async function createInvoice(data: {
  orderId: string;
  userId: string;
  amount?: number; // accepted but NOT stored
}) {
  return prisma.invoice.create({
    data: {
      orderId: data.orderId,
      userId: data.userId,
      fileUrl: "", // placeholder (later update after PDF upload)
    },
  });
}

/**
 * Get invoice by ID
 */
export async function getInvoiceById(id: string) {
  return prisma.invoice.findUnique({
    where: { id },
  });
}

/**
 * List all invoices
 */
export async function listInvoices() {
  return prisma.invoice.findMany({
    orderBy: { createdAt: "desc" },
  });
}

