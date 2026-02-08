import { getKafkaProducer } from "./kafka-client";
import { PAYMENT_TOPICS } from "./payment.topics";
import {
  PaymentSuccessEvent,
  PaymentFailedEvent,
} from "./payment.events";

export async function publishPaymentSuccess(
  event: PaymentSuccessEvent
) {
  const producer = await getKafkaProducer();
  if (!producer) return;

  await producer.send({
    topic: PAYMENT_TOPICS.PAYMENT_SUCCESS,
    messages: [{ value: JSON.stringify(event) }],
  });

  console.log("📤 payment.success published", event);
}

export async function publishPaymentFailed(
  event: PaymentFailedEvent
) {
  const producer = await getKafkaProducer();
  if (!producer) return;

  await producer.send({
    topic: PAYMENT_TOPICS.PAYMENT_FAILED,
    messages: [{ value: JSON.stringify(event) }],
  });

  console.log("📤 payment.failed published", event);
}

