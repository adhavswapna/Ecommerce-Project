import bcrypt from "bcrypt";
import prisma from "../db/prisma/prisma";
import { sendMessage } from "../kafka/kafka-producer";
import { KAFKA_TOPICS } from "../kafka/kafka-topics";

export async function createAdmin(email: string, password: string) {
  const hashed = await bcrypt.hash(password, 10);

  const admin = await prisma.admin.create({
    data: {
      email,
      password: hashed,
    },
  });

  // 🔥 Emit Kafka event AFTER DB success
  await sendMessage(KAFKA_TOPICS.ADMIN.CREATED, {
    adminId: admin.id,
    email: admin.email,
    createdAt: admin.createdAt,
  });

  return admin;
}

