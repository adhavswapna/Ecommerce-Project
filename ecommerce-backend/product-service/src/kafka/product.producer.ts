// src/kafka/product-producer.ts

import { getProducer } from "./kafka.client";
import { PRODUCT_TOPICS } from "./product.topics";

export const publishProductCreated = async (data: any) => {
  const producer = await getProducer();
  if (!producer) return;

  await producer.send({
    topic: PRODUCT_TOPICS.PRODUCT_CREATED,
    messages: [{ value: JSON.stringify(data) }],
  });

  console.log("📤 product.created event sent");
};

export const publishProductUpdated = async (data: any) => {
  const producer = await getProducer();
  if (!producer) return;

  await producer.send({
    topic: PRODUCT_TOPICS.PRODUCT_UPDATED,
    messages: [{ value: JSON.stringify(data) }],
  });

  console.log("📤 product.updated event sent");
};

export const publishProductDeleted = async (data: any) => {
  const producer = await getProducer();
  if (!producer) return;

  await producer.send({
    topic: PRODUCT_TOPICS.PRODUCT_DELETED,
    messages: [{ value: JSON.stringify(data) }],
  });

  console.log("📤 product.deleted event sent");
};
