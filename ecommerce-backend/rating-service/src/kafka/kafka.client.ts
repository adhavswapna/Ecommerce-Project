import { Kafka, Producer } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'rating-service',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});

export const kafkaProducer: Producer = kafka.producer();

export async function connectKafka() {
  await kafkaProducer.connect();
  console.log('Kafka producer connected for rating-service');
}

