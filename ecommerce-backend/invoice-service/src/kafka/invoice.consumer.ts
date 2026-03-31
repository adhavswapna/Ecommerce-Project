// src/kafka/invoice.consumer.ts
import { getKafkaConsumer } from "./kafka-client";
import { INVOICE_TOPICS } from "./invoice.topics";
import { publishInvoiceGenerated } from "./invoice.producer";
import { generateInvoicePDF, InvoiceData } from "../pdf/invoice.pdf";
import {
  uploadInvoicePDF,
  getMinioPresignedUrl,
} from "../minio/minio-client";

export async function startInvoiceConsumer() {
  const consumer = await getKafkaConsumer();
  if (!consumer) return;

  await consumer.subscribe({
    topic: INVOICE_TOPICS.INVOICE_REQUESTED,
    fromBeginning: false,
  });

  console.log("🧾 Invoice consumer started (invoice.requested)");

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;

      let data: any;

      try {
        data = JSON.parse(message.value.toString());
      } catch (err) {
        console.error("❌ Invalid invoice.requested JSON", err);
        return;
      }

      console.log("📥 invoice.requested received:", data.orderId);

      try {
        const invoiceData: InvoiceData = {
          orderId: data.orderId,
          customerName: data.customerName || "Customer",
          customerEmail: data.customerEmail || data.userEmail || "N/A",
          billingAddress: data.billingAddress || "N/A",
          shippingAddress: data.shippingAddress || "N/A",
          vendorName: data.vendorName || "Store",
          vendorAddress: "Online Store",
          items: data.items || [],
          date: new Date().toISOString(),
        };

        // 1. Generate PDF
        const pdfBuffer = await generateInvoicePDF(invoiceData);

        const fileName = `${data.orderId}.pdf`;

        // 2. Upload to MinIO
        await uploadInvoicePDF(fileName, pdfBuffer);

        // 3. Signed URL
        const presignedUrl = await getMinioPresignedUrl(fileName);

        // 4. Publish event
        await publishInvoiceGenerated({
          invoiceId: `inv_${Date.now()}`,
          orderId: data.orderId,
          amount: data.amount,
          userEmail: data.userEmail || data.customerEmail || "N/A",
          vendorEmail: data.vendorEmail || "N/A",
          invoiceUrl: presignedUrl,
          createdAt: new Date().toISOString(),
        });

        console.log("✅ invoice.generated published");
      } catch (err) {
        console.error("🔥 Invoice processing failed:", err);
      }
    },
  });
}
