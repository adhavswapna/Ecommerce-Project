import { Kafka } from 'kafkajs';
import prisma from '../../db/prisma/prisma';

const kafka = new Kafka({
  clientId: 'user-service',
  brokers: [process.env.KAFKA_BROKER!],
});

const consumer = kafka.consumer({ groupId: 'user-service-group' });

export const startUserConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'user.created' });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const user = JSON.parse(message.value!.toString());

      await prisma.user.create({
        data: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      });

      console.log('✅ User created in user-service');
    },
  });
};
