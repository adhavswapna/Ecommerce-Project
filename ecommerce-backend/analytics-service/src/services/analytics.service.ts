import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function recordEvent(eventType: string, payload: any) {
  await prisma.analyticsEvent.create({
    data: {
      eventType,
      payload,
    },
  });

  console.log(`📊 Analytics event stored → ${eventType}`);
}

