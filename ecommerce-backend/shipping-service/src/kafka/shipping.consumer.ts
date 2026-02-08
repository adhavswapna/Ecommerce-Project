import { getKafka } from "./kafka.client";
import { SHIPPING_TOPICS } from "./shipping.topics";

export async function startShippingConsumer() {
  const kafka = getKafka();
  const consumer = kafka.consumer({ groupId: "shipping-group" });

  await consumer.connect();

  await consumer.subscribe({
    topic: SHIPPING_TOPICS.ORDER_PAID,
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const payload = JSON.parse(message.value!.toString());

      console.log("📦 Shipping started for order:", payload);

      // later you can emit ORDER_SHIPPED event
    },
  });

  console.log("✅ Shipping consumer running");
}

