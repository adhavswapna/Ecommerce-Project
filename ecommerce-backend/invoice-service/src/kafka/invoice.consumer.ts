// src/kafka/invoice.consumer.ts
import { getKafkaConsumer } from "./kafka-client";
import { INVOICE_TOPICS } from "./invoice.topics";
import { PaymentSuccessEvent } from "./invoice.events";
import { publishInvoiceGenerated } from "./invoice.producer";
import { generateInvoicePDF, InvoiceData } from "../pdf/invoice.pdf";
import { uploadInvoicePDF, getMinioPresignedUrl } from "../minio/minio-client";

export async function startInvoiceConsumer() {
  const consumer = await getKafkaConsumer();
  if (!consumer) return;

  await consumer.subscribe({
    topic: INVOICE_TOPICS.PAYMENT_SUCCESS,
    fromBeginning: false,
  });

  console.log("🧾 Invoice Kafka consumer started");

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;

      let data: PaymentSuccessEvent & { 
        customerName?: string;
        billingAddress?: string;
        shippingAddress?: string;
        vendorEmail?: string;
        items?: any[];
      };

      try {
        data = JSON.parse(message.value.toString());
      } catch (err) {
        console.error("❌ Invalid JSON in payment.success:", err);
        return;
      }

      console.log("📥 payment.success received", data);

      try {
        // ---------------- Generate PDF ----------------
        const invoiceData: InvoiceData = {
          orderId: data.orderId,
          customerName: data.customerName || data.userEmail,
          customerEmail: data.userEmail,
          billingAddress: data.billingAddress || "N/A",
          shippingAddress: data.shippingAddress || "N/A",
          vendorName: data.vendorName,
          vendorAddress: data.vendorEmail ? "Vendor Address" : undefined,
          items: data.items || [],
          date: new Date().toISOString(),
        };

        const pdfBuffer = await generateInvoicePDF(invoiceData);

        const fileName = `${data.orderId}.pdf`;
        await uploadInvoicePDF(fileName, pdfBuffer);

        // ---------------- Pre-signed URL ----------------
        const presignedUrl = await getMinioPresignedUrl(fileName);

        // ---------------- Publish invoice.generated ----------------
        await publishInvoiceGenerated({
          invoiceId: "inv_" + Date.now(),
          orderId: data.orderId,
          amount: data.amount,
          userEmail: data.userEmail,
          vendorEmail: data.vendorEmail, 
          invoiceUrl: presignedUrl,
          createdAt: new Date().toISOString(),
        });

        console.log("📤 invoice.generated published with pre-signed URL");
      } catch (err) {
        console.error("🔥 Error generating/uploading invoice:", err);
      }
    },
  });
}

