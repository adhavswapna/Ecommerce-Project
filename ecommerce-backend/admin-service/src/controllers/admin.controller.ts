import { Request, Response } from "express";
import { produceMessage } from "../kafka/kafka-producer";
import { ADMIN_TOPICS, UserBannedEvent, SystemAlertEvent } from "../kafka/events/admin-events";

/**
 * Create admin
 * Example: POST /admin
 * Body: { userId: string }
 */
export async function createAdmin(req: Request, res: Response) {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  // Example Kafka event for admin creation
  const event: SystemAlertEvent = {
    alertId: userId,
    message: `Admin created with ID: ${userId}`,
    severity: "low",
    createdAt: new Date().toISOString(),
  };

  await produceMessage(ADMIN_TOPICS.SYSTEM_ALERT, event);

  res.json({ message: "Admin created and Kafka event sent ✅", event });
}

/**
 * Health check endpoint
 * Example: GET /admin/health
 */
export function adminHealth(req: Request, res: Response) {
  res.json({ status: "Admin service is healthy ✅" });
}

/**
 * Optional: Ban user endpoint
 * Example: POST /admin/user/ban
 * Body: { userId: string, reason?: string }
 */
export async function banUser(req: Request, res: Response) {
  const { userId, reason } = req.body;

  if (!userId) return res.status(400).json({ error: "userId is required" });

  const event: UserBannedEvent = {
    userId,
    bannedAt: new Date().toISOString(),
    reason,
  };

  await produceMessage(ADMIN_TOPICS.USER_BANNED, event);

  res.json({ message: "User banned event sent ✅", event });
}

