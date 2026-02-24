// src/kafka/invoice.consumer.ts
import { getKafkaConsumer } from "./kafka-client";
import { INVOICE_TOPICS } from "./invoice.topics";
import { PaymentSuccessEvent, InvoiceGeneratedEvent } from "./invoice.events";
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

      let data: PaymentSuccessEvent;
      try {
        data = JSON.parse(message.value.toString());
      } catch (err) {
        console.error("❌ Invalid JSON in payment.success:", message.value.toString());
        return;
      }

      console.log("📥 payment.success received", data);

      try {
        // ---------------- Prepare Invoice Data ----------------
        const invoiceData: InvoiceData = {
          orderId: data.orderId,
          customerName: data.customerName || "Customer",
          customerEmail: data.userEmail,
          billingAddress: data.billingAddress || "",
          shippingAddress: data.shippingAddress || "",
          vendorName: data.vendorName,
          vendorAddress: data.vendorAddress,
          gstNumber: data.gstNumber,
          panNumber: data.panNumber,
          items: data.items || [],
          date: new Date().toISOString(),
        };

        // ---------------- Generate PDF ----------------
        const pdfBuffer = await generateInvoicePDF(invoiceData);

        const fileName = `${data.orderId}.pdf`;

        // ---------------- Upload to MinIO ----------------
        await uploadInvoicePDF(fileName, pdfBuffer);

        // ---------------- Generate Pre-signed URL ----------------
        const invoiceUrl = await getMinioPresignedUrl(fileName);

        // ---------------- Publish Invoice Generated Event ----------------
        const invoiceEvent: InvoiceGeneratedEvent = {
          invoiceId: "inv_" + Date.now(),
          orderId: data.orderId,
          amount: data.amount,
          userEmail: data.userEmail,
          vendorEmail: data.vendorEmail, // optional
          invoiceUrl,
          createdAt: new Date().toISOString(),
        };

        await publishInvoiceGenerated(invoiceEvent);

        console.log("📤 invoice.generated published", invoiceEvent);
      } catch (err) {
        console.error("🔥 Error generating/uploading invoice:", err);
      }
    },
  });
}

