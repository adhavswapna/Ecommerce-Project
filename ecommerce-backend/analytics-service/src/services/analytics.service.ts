
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

export async function getVendorAnalytics(
  vendorId?: string
) {
  /*
   * AnalyticsEvent currently stores userId.
   *
   * vendorId is used to filter events belonging
   * to the vendor's authenticated user.
   */

  const where = vendorId
    ? { userId: vendorId }
    : {};

  const events =
    await prisma.analyticsEvent.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });

  // ===================================================
  // COUNT EVENTS BY TYPE
  // ===================================================

  const eventCounts: Record<string, number> = {};

  for (const item of events) {
    eventCounts[item.event] =
      (eventCounts[item.event] || 0) + 1;
  }

  return {
    vendorId: vendorId || null,
    totalEvents: events.length,
    eventCounts,
    recentEvents: events.slice(0, 20),
  };
}

// =====================================================
// GET ADMIN / PLATFORM ANALYTICS
// =====================================================

export async function getAdminAnalytics() {
  /*
   * Admin analytics are platform-wide.
   *
   * No vendorId filter is applied.
   */

  const events =
    await prisma.analyticsEvent.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

  // ===================================================
  // COUNT EVENTS BY TYPE
  // ===================================================

  const eventCounts: Record<string, number> = {};

  for (const item of events) {
    eventCounts[item.event] =
      (eventCounts[item.event] || 0) + 1;
  }

  // ===================================================
  // COUNT UNIQUE USERS
  // ===================================================

  const uniqueUsers = new Set(
    events.map((item) => item.userId)
  );

  // ===================================================
  // RETURN PLATFORM ANALYTICS
  // ===================================================

  return {
    totalEvents: events.length,
    totalUsers: uniqueUsers.size,
    eventCounts,
    recentEvents: events.slice(0, 20),
  };
}

