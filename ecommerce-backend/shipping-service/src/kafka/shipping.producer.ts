import { getKafka } from "./kafka.client";
import { SHIPPING_TOPICS } from "./shipping.topics";

const kafka = getKafka();
const producer = kafka.producer();

export async function connectProducer() {
  await producer.connect();
}

export async function emitShippingCreated(payload: any) {
  await producer.send({
    topic: SHIPPING_TOPICS.SHIPPING_CREATED,
    messages: [
      {
        key: payload.orderId,
        value: JSON.stringify(payload),
      },
    ],
  });
}

export async function emitOutForDelivery(payload: any) {
  await producer.send({
    topic: SHIPPING_TOPICS.SHIPPING_OUT_FOR_DELIVERY,
    messages: [
      {
        key: payload.orderId,
        value: JSON.stringify(payload),
      },
    ],
  });
}

export async function emitDelivered(payload: any) {
  await producer.send({
    topic: SHIPPING_TOPICS.SHIPPING_DELIVERED,
    messages: [
      {
        key: payload.orderId,
        value: JSON.stringify(payload),
      },
    ],
  });
}

export async function emitCancelled(payload: any) {
  await producer.send({
    topic: SHIPPING_TOPICS.SHIPPING_CANCELLED,
    messages: [
      {
        key: payload.orderId,
        value: JSON.stringify(payload),
      },
    ],
  });
}
