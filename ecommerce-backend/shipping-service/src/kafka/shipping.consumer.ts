import { consumer } from "./kafka-client";

export const startShippingConsumer = async () => {
  await consumer.connect();

  await consumer.subscribe({
    topic: "order.created",
    fromBeginning: true
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const value = message.value?.toString();
      if (!value) return;

      const order = JSON.parse(value);

      console.log("📦 Shipping received order:", order);

      // TODO: create shipment entry
    }
  });
};

