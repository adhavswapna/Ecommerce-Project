import { getKafkaProducer } from "./kafka-client";
import { ORDER_TOPICS } from "./order-topics";
import { OrderCreatedEvent, OrderUpdatedEvent } from "./order-events";

export async function publishOrderCreated(
  event: OrderCreatedEvent
) {
  const producer = await getKafkaProducer();
  if (!producer) return;

  await producer.send({
    topic: ORDER_TOPICS.CREATED,
    messages: [{ value: JSON.stringify(event) }],
  });

  console.log("📤 Order Created event published", event);
}

export async function publishOrderUpdated(
  event: OrderUpdatedEvent
) {
  const producer = await getKafkaProducer();
  if (!producer) return;

  await producer.send({
    topic: ORDER_TOPICS.UPDATED,
    messages: [{ value: JSON.stringify(event) }],
  });

  console.log("📤 Order Updated event published", event);
}

