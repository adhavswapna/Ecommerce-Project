// src/services/notification.service.ts

import { broadcast } from "../websocket/websocket";
import { sendNotificationEvent } from "../kafka/notification.producer";

export const handleNotification = async (data: any) => {
  if (!data || !data.userId) {
    throw new Error("userId is required");
  }

  // 🔔 Send real-time update
  broadcast(data);

  // 📡 Send Kafka event
  await sendNotificationEvent("notification.created", data);

  console.log("✅ Notification processed:", data);

  return {
    success: true,
    message: "Notification sent successfully",
    data,
  };
};
