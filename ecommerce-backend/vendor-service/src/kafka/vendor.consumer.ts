import { kafka } from './vendor.client';
import { KAFKA_TOPICS } from './vendor.topics';

const consumer = kafka.consumer({ groupId: 'vendor-service-group' });

export const connectConsumer = async () => {
  await consumer.connect();
  console.log('Kafka consumer connected');

  await consumer.subscribe({ topic: KAFKA_TOPICS.VENDOR_CREATED, fromBeginning: true });
  await consumer.subscribe({ topic: KAFKA_TOPICS.VENDOR_STATUS_UPDATED, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      console.log(`Received message on topic ${topic}: ${message.value?.toString()}`);
    },
  });
};

