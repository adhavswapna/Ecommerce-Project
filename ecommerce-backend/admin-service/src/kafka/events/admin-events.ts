// Kafka Topics
export const ADMIN_TOPICS = {
  USER_BANNED: "admin.user.banned",
  USER_ROLE_UPDATED: "admin.user.role.updated",
  SYSTEM_ALERT: "admin.system.alert",
};

// Event Interfaces
export interface UserBannedEvent {
  userId: string;
  bannedAt: string;
  reason?: string;
}

export interface UserRoleUpdatedEvent {
  userId: string;
  oldRole: string;
  newRole: string;
  updatedAt: string;
}

export interface SystemAlertEvent {
  alertId: string;
  message: string;
  severity: "low" | "medium" | "high";
  createdAt: string;
}

