import { getKafkaProducer } from "./kafka-client";
import { SHIPPING_TOPICS } from "./shipping.topics";
import { ShippingCreatedEvent } from "./shipping.events";

export const publishShipmentCreated = async (
  data: ShippingCreatedEvent
) => {
  const producer = await getKafkaProducer();
  if (!producer) return;

  await producer.send({
    topic: SHIPPING_TOPICS.SHIPPING_CREATED,
    messages: [{ value: JSON.stringify(data) }],
  });

  console.log("📤 shipping.created published", data);
};

