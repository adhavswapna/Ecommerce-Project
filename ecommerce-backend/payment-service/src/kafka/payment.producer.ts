import { getKafkaProducer } from "./kafka-client";
import { PAYMENT_TOPICS } from "./payment.topics";
import { PaymentCompletedEvent } from "./payment.events";

export async function publishPaymentCompleted(event: PaymentCompletedEvent) {
  const producer = await getKafkaProducer();
  if (!producer) return;

  await producer.send({
    topic: PAYMENT_TOPICS.PAYMENT_COMPLETED,
    messages: [{ value: JSON.stringify(event) }],
  });

  console.log("📤 Payment completed event published", event);
}

