// src/services/invoice.service.ts
import prisma from "../db/prisma/prisma";
import { PaymentCompletedEvent, InvoiceGeneratedEvent } from "../kafka/invoice.events";
import { v4 as uuidv4 } from "uuid";
import { generateInvoicePDF, storeInvoicePDF } from "../pdf/invoice.pdf";
import { publishInvoiceGenerated } from "../kafka/invoice.producer";

/**
 * Create a new invoice in DB (Prisma)
 */
export async function createInvoice(data: {
  orderId: string;
  userId: string;
  fileUrl: string;
}) {
  return prisma.invoice.create({
    data: {
      orderId: data.orderId,
      userId: data.userId,
      fileUrl: data.fileUrl,
    },
  });
}

/**
 * Generate PDF, upload to MinIO, save DB, and emit Kafka event
 */
export async function generateAndStoreInvoice(payment: PaymentCompletedEvent) {
  const invoiceId = uuidv4();

  // 1️⃣ Generate PDF buffer
  const pdfBuffer = generateInvoicePDF(payment);

  // 2️⃣ Upload PDF to MinIO
  const fileKey = await storeInvoicePDF(invoiceId, pdfBuffer);

  console.log("✅ Invoice PDF uploaded to MinIO:", fileKey);

  // 3️⃣ Save invoice in DB
  await createInvoice({
    orderId: payment.orderId,
    userId: payment.userId,
    fileUrl: fileKey, // store MinIO object key
  });

  // 4️⃣ Publish Kafka event
  const invoiceEvent: InvoiceGeneratedEvent = {
    invoiceId,
    orderId: payment.orderId,
    amount: payment.amount,
    fileKey,
    createdAt: new Date().toISOString(),
  };

  await publishInvoiceGenerated(invoiceEvent);
  console.log("📤 InvoiceGeneratedEvent published:", invoiceEvent);
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

