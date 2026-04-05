// src/services/notification.service.ts

import { broadcast } from "../websocket/websocket";

export const handleNotification = async (data: any) => {
  if (!data || !data.userId) {
    throw new Error("userId is required");
  }

  // 🔔 Send real-time update to frontend
  broadcast(data);

  console.log("✅ Notification processed:", data);

  return {
    success: true,
    message: "Notification sent successfully",
    data,
  };
};
