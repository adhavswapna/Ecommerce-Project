import { getUserConsumer } from './kafka.client';
import { USER_TOPICS } from './user.topics';
import prisma from '../db/prisma/prisma';

export async function startUserConsumer() {
  const consumer = await getUserConsumer();

  await consumer.subscribe({
    topic: USER_TOPICS.AUTH_USER_CREATED,
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;

      const payload = JSON.parse(message.value.toString());

      const user = payload.data;

      await prisma.user.create({
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });

      console.log('✅ User created:', user.email);
    },
  });
}

