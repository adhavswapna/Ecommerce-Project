import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function recordAnalyticsEvent(payload: any) {
  const { event, userId, data } = payload;

  if (!event || !userId) {
    throw new Error("event and userId are required");
  }

  const result = await prisma.analyticsEvent.create({
    data: {
      event: event,
      userId: userId,
      data: data || {},
    },
  });

  console.log(`📊 Analytics event stored → ${event}`);

  return result;
}
