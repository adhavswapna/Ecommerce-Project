import { getKafkaProducer } from "./kafka.client";
import { ORDER_TOPICS } from "./order.topics";
import {
  OrderCreatedEvent,
  OrderCancelledEvent,
} from "./order.events";

export async function publishOrderCreated(payload: OrderCreatedEvent) {
  const producer = await getKafkaProducer();
  if (!producer) return;

  await producer.send({
    topic: ORDER_TOPICS.CREATED,
    messages: [{ value: JSON.stringify(payload) }],
  });

  console.log("📤 order.created published", payload);
}

export async function publishOrderCancelled(payload: OrderCancelledEvent) {
  const producer = await getKafkaProducer();
  if (!producer) return;

  await producer.send({
    topic: ORDER_TOPICS.CANCELLED,
    messages: [{ value: JSON.stringify(payload) }],
  });

  console.log("📤 order.cancelled published", payload);
}

