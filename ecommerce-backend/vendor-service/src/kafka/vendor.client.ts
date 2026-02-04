
import { Kafka } from 'kafkajs';
import { KAFKA_BROKER } from './vendor.topics';

export const kafka = new Kafka({
  clientId: 'vendor-service',
  brokers: [KAFKA_BROKER],
});

