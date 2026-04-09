import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'rating-service',
  brokers: ['localhost:9092'],
});

export const producer = kafka.producer();

export async function connectKafka() {
  await producer.connect();
  console.log('✅ Kafka connected (rating-service)');
}
