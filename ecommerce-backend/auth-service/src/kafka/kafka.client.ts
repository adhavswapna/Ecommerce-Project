import {
  Kafka,
  Producer,
  Consumer,
} from "kafkajs";

const kafka = new Kafka({
  clientId:
    process.env.SERVICE_NAME ||
    "auth-service",

  brokers: [
    process.env.KAFKA_BROKER ||
    "localhost:9092",
  ],
});

let producer: Producer | null = null;

/* =====================================================
   KAFKA PRODUCER
===================================================== */

export async function getProducer(): Promise<Producer | null> {
  if (process.env.ENABLE_KAFKA !== "true") {
    return null;
  }

  if (!producer) {
    producer = kafka.producer();

    await producer.connect();

    console.log(
      "✅ Auth Kafka Producer connected"
    );
  }

  return producer;
}

/* =====================================================
   KAFKA CONSUMER
===================================================== */

export function createConsumer(
  groupId: string
): Consumer {
  return kafka.consumer({
    groupId,
  });
}

/* =====================================================
   EXPORT KAFKA CLIENT
===================================================== */

export { kafka };
