"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useNotificationStore } from "@/store/notification.store";

export const useLiveNotification = () => {
  const user = useAuthStore((state) => state.user);
  const addNotification = useNotificationStore(
    (state: any) => state.addNotification
  );

  useEffect(() => {
    if (!user?.id) return;

    // 🔌 Connect WebSocket with userId
    const ws = new WebSocket(
      `ws://localhost:3005?userId=${user.id}`
    );

    ws.onopen = () => {
      console.log("✅ WebSocket connected for user:", user.id);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        console.log("🔔 Live Notification:", data);

        // 🔥 Add to global store
        addNotification({
          id: Date.now(), // temporary id
          type: data.type || "INFO",
          message: data.message || "New notification",
          createdAt: new Date().toISOString(),
        });
      } catch (err) {
        console.error("❌ Invalid notification data:", err);
      }
    };

    ws.onerror = (err) => {
      console.error("❌ WebSocket error:", err);
    };

    ws.onclose = () => {
      console.log("❌ WebSocket disconnected");
    };

    // 🧹 Cleanup on unmount
    return () => {
      ws.close();
    };
  }, [user?.id, addNotification]);
};
