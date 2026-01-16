import { prisma } from "../prisma/prisma";
import { publishUserCreated } from "../kafka/user.producer";

export async function createUser(email: string) {
  const user = await prisma.user.create({
    data: { email },
  });

  await publishUserCreated(user);

  return user;
}
