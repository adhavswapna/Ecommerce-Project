
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// =====================================================
// RECORD ANALYTICS EVENT
// =====================================================

export async function recordAnalyticsEvent(payload: any) {
  const { event, userId, data } = payload;

  if (!event || !userId) {
    throw new Error("event and userId are required");
  }

  const result = await prisma.analyticsEvent.create({
    data: {
      event,
      userId,
      data: data || {},
    },
  });

  console.log(`📊 Analytics event stored → ${event}`);

  return result;
}

// =====================================================
// GET VENDOR ANALYTICS
// =====================================================

export async function getVendorAnalytics(vendorId?: string) {
  /*
   * At the moment AnalyticsEvent stores userId.
   *
   * Since analytics-service has no authentication middleware,
   * we allow vendorId to be supplied as a query parameter.
   *
   * Example:
   * GET /analytics/vendor?vendorId=VENDOR_ID
   */

  const where = vendorId
    ? { userId: vendorId }
    : {};

  const events = await prisma.analyticsEvent.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  // Count events by type
  const eventCounts: Record<string, number> = {};

  for (const item of events) {
    eventCounts[item.event] = (eventCounts[item.event] || 0) + 1;
  }

  return {
    vendorId: vendorId || null,
    totalEvents: events.length,
    eventCounts,
    recentEvents: events.slice(0, 20),
  };
}
