import { getKafkaProducer } from "./kafka.client";
import { CART_TOPICS } from "./cart.topics";
import {
  CartItemAddedEvent,
  CartItemRemovedEvent,
  CartClearedEvent,
} from "./cart.events";

export async function publishCartItemAdded(payload: CartItemAddedEvent) {
  const producer = await getKafkaProducer();
  if (!producer) return;

  await producer.send({
    topic: CART_TOPICS.ITEM_ADDED,
    messages: [{ value: JSON.stringify(payload) }],
  });

  console.log("📤 cart.item.added published", payload);
}

export async function publishCartItemRemoved(payload: CartItemRemovedEvent) {
  const producer = await getKafkaProducer();
  if (!producer) return;

  await producer.send({
    topic: CART_TOPICS.ITEM_REMOVED,
    messages: [{ value: JSON.stringify(payload) }],
  });

  console.log("📤 cart.item.removed published", payload);
}

export async function publishCartCleared(payload: CartClearedEvent) {
  const producer = await getKafkaProducer();
  if (!producer) return;

  await producer.send({
    topic: CART_TOPICS.CART_CLEARED,
    messages: [{ value: JSON.stringify(payload) }],
  });

  console.log("📤 cart.cleared published", payload);
}
