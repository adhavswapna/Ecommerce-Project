import { getProducer } from "./kafka-client";

export async function produceMessage(topic: string, message: any) {
  const producer = await getProducer();
  if (!producer) return;

  try {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
    console.log(`Message produced to ${topic} ✅`, message);
  } catch (error) {
    console.error("Kafka produce error:", error);
  }
}

