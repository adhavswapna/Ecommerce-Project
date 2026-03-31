"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useNotificationStore } from "@/store/notification.store";
import toast from "react-hot-toast";

export const useLiveNotification = () => {
  const user = useAuthStore((state) => state.user);
  const addNotification = useNotificationStore(
    (state) => state.addNotification
  );

  // 🔥 Keep socket reference
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    let isMounted = true;

    const connectWebSocket = () => {
      // 🔥 Prevent duplicate connection
      if (wsRef.current) return;

      const ws = new WebSocket(
        `ws://localhost:3005?userId=${user.id}`
      );

      wsRef.current = ws;

      ws.onopen = () => {
        console.log("✅ WebSocket connected:", user.id);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          console.log("🔔 Notification:", data);

          const notification = {
            id: crypto.randomUUID(), // better unique id
            type: data.type || "INFO",
            message: data.message || "New notification",
            createdAt: new Date().toISOString(),
          };

          // 🔥 Store update
          addNotification(notification);

          // 🔥 Toast popup
          toast.success(notification.message);

        } catch (err) {
          console.error("❌ Invalid notification:", err);
        }
      };

      ws.onerror = (err) => {
        console.error("❌ WebSocket error:", err);
      };

      ws.onclose = () => {
        console.log("⚠️ WebSocket disconnected");

        wsRef.current = null;

        // 🔁 Auto-reconnect after 3 sec
        if (isMounted) {
          reconnectRef.current = setTimeout(() => {
            console.log("🔄 Reconnecting WebSocket...");
            connectWebSocket();
          }, 3000);
        }
      };
    };

    // 🔌 Initial connect
    connectWebSocket();

    return () => {
      isMounted = false;

      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }

      if (reconnectRef.current) {
        clearTimeout(reconnectRef.current);
      }
    };
  }, [user?.id, addNotification]);
};
