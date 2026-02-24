import { Kafka, Producer } from 'kafkajs';

const kafka = new Kafka({
  clientId: process.env.SERVICE_NAME || 'auth-service',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});

let producer: Producer | null = null;

export async function getProducer(): Promise<Producer | null> {
  if (process.env.ENABLE_KAFKA !== 'true') {
    return null;
  }

  if (!producer) {
    producer = kafka.producer();
    await producer.connect();
    console.log('✅ Kafka producer connected');
  }

  return producer;
}

