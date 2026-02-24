// src/kafka/invoice.producer.ts
import { getKafkaProducer } from "./kafka-client";
import { INVOICE_TOPICS } from "./invoice.topics";
import { InvoiceGeneratedEvent } from "./invoice.events";

export async function publishInvoiceGenerated(
  payload: InvoiceGeneratedEvent
) {
  const producer = await getKafkaProducer();
  if (!producer) return;

  await producer.send({
    topic: INVOICE_TOPICS.INVOICE_GENERATED,
    messages: [{ value: JSON.stringify(payload) }],
  });

  console.log("📤 invoice.generated event published", payload);
}

