import { kafka } from './vendor.client';
import { KAFKA_TOPICS } from './vendor.topics';
import { VendorCreatedEvent, VendorStatusUpdatedEvent } from './vendor.events';

const producer = kafka.producer();

export const connectProducer = async () => {
  await producer.connect();
  console.log('Kafka producer connected');
};

export const produceVendorCreated = async (event: VendorCreatedEvent) => {
  await producer.send({
    topic: KAFKA_TOPICS.VENDOR_CREATED,
    messages: [{ value: JSON.stringify(event) }],
  });
  console.log('vendor.created event produced:', event);
};

export const produceVendorStatusUpdated = async (event: VendorStatusUpdatedEvent) => {
  await producer.send({
    topic: KAFKA_TOPICS.VENDOR_STATUS_UPDATED,
    messages: [{ value: JSON.stringify(event) }],
  });
  console.log('vendor.status.updated event produced:', event);
};

export const disconnectProducer = async () => {
  await producer.disconnect();
};

