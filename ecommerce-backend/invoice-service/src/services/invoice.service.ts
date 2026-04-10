import prisma from "../db/prisma/prisma";
import { v4 as uuidv4 } from "uuid";
import {
  generateInvoicePDF,
  storeInvoicePDF,
} from "../pdf/invoice.pdf";
import { publishInvoiceGenerated } from "../kafka/invoice.producer";

/**
 * Create invoice in DB
 */
export async function createInvoice(data: {
  orderId: string;
  userId: string;
  fileUrl: string;
}) {
  return prisma.invoice.create({ data });
}

/**
 * Common input type (API + Kafka)
 */
export interface GenerateInvoiceInput {
  orderId: string;
  userId: string;
  amount: number;
}

/**
 * 🔥 MAIN FUNCTION (IDEMPOTENT + PRODUCTION SAFE)
 */
export async function generateAndStoreInvoice(
  input: GenerateInvoiceInput
) {
  const { orderId, userId, amount } = input;

  if (!userId) {
    throw new Error("userId is required");
  }

  try {
    /**
     * ✅ 1. IDEMPOTENCY CHECK
     * Prevent duplicate invoice creation
     */
    const existingInvoice = await prisma.invoice.findUnique({
      where: { orderId },
    });

    if (existingInvoice) {
      console.log("⚠️ Invoice already exists, returning existing");
      return existingInvoice;
    }

    /**
     * 2️⃣ Generate invoice ID
     */
    const invoiceId = uuidv4();

    /**
     * 3️⃣ Prepare PDF data
     */
    const invoiceData = {
      orderId,
      customerName: "Demo User",
      customerEmail: "user@test.com",
      billingAddress: "Pune, India",
      shippingAddress: "Pune, India",
      date: new Date().toISOString(),
      items: [
        {
          description: "Order Payment",
          unitPrice: amount,
          quantity: 1,
          taxRate: 18,
        },
      ],
    };

    /**
     * 4️⃣ Generate PDF
     */
    const pdfBuffer = await generateInvoicePDF(invoiceData);

    /**
     * 5️⃣ Upload to MinIO
     */
    const fileKey = await storeInvoicePDF(invoiceId, pdfBuffer);
    console.log("✅ PDF uploaded:", fileKey);

    /**
     * 6️⃣ Save to DB
     */
    const invoice = await prisma.invoice.create({
      data: {
        orderId,
        userId,
        fileUrl: fileKey,
      },
    });

    console.log("✅ Invoice saved in DB");

    /**
     * 7️⃣ Publish Kafka event (non-blocking)
     */
    try {
      await publishInvoiceGenerated({
        invoiceId,
        orderId,
        amount,
        fileKey,
        createdAt: new Date().toISOString(),
      });

      console.log("📤 Kafka event published");
    } catch (kafkaError) {
      console.error("⚠️ Kafka failed (ignored):", kafkaError);
    }

    return invoice;
  } catch (error: any) {
    /**
     * ✅ EXTRA SAFETY (handles race condition)
     */
    if (error.code === "P2002") {
      console.warn("⚠️ Race condition detected, fetching existing invoice");

      const existingInvoice = await prisma.invoice.findUnique({
        where: { orderId },
      });

      if (existingInvoice) return existingInvoice;
    }

    console.error("❌ Invoice generation failed:", error);
    throw error;
  }
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
