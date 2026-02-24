import { prisma } from './prisma';
import { producer } from './kafka';

export async function createUser(email: string) {
  const user = await prisma.user.create({ data: { email } });

  await producer.send({
    topic: 'user.created',
    messages: [{ value: JSON.stringify(user) }],
  });

  return user;
}

