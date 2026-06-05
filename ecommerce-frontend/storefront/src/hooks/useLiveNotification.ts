"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useNotificationStore } from "@/store/notification.store";
import toast from "react-hot-toast";

export const useLiveNotification = () => {
  const user = useAuthStore((state) => state.user);
  const addNotification = useNotificationStore((state) => state.addNotification);

  const wsRef = useRef<WebSocket | null>(null);
  const retryRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    let active = true;
    let retryCount = 0;
    const MAX_RETRY = 5;

    const API_URL =
      process.env.NEXT_PUBLIC_NOTIFICATION_API_URL ||
      "http://localhost:3018";

    const WS_URL =
      process.env.NEXT_PUBLIC_NOTIFICATION_WS_URL ||
      "ws://localhost:3018/ws";

    // =========================
    // SAFE FETCH (NO CRASH)
    // =========================
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${API_URL}/notifications/${user.id}`);

        if (!res.ok) {
          console.warn("⚠️ Notification API error:", res.status);
          return;
        }

        const data = await res.json();

        if (Array.isArray(data)) {
          data.forEach((n) => addNotification(n));
        }
      } catch (err) {
        console.warn("⚠️ Notification fetch failed (ignored):", err);
      }
    };

    // =========================
    // WS CONNECT
    // =========================
    const connectWS = () => {
      if (!active) return;

      if (
        wsRef.current &&
        (wsRef.current.readyState === WebSocket.OPEN ||
          wsRef.current.readyState === WebSocket.CONNECTING)
      ) {
        return;
      }

      const url = `${WS_URL}?userId=${user.id}`;

      try {
        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onopen = () => {
          console.log("✅ WebSocket connected");
          retryCount = 0;
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            addNotification({
              id: crypto.randomUUID(),
              type: data.type || "INFO",
              message: data.message || "Notification",
              createdAt: new Date().toISOString(),
            });

            toast.success(data.message || "New notification");
          } catch (err) {
            console.warn("Invalid WS message:", err);
          }
        };

        ws.onerror = () => {
          console.warn("❌ WebSocket connection failed:", url);
        };

        ws.onclose = () => {
          wsRef.current = null;

          if (!active) return;

          if (retryCount >= MAX_RETRY) {
            console.warn("❌ WS max retry reached");
            return;
          }

          retryCount++;

          retryRef.current = setTimeout(() => {
            connectWS();
          }, 3000);
        };
      } catch (err) {
        console.warn("WS init error:", err);
      }
    };

    fetchNotifications();
    connectWS();

    return () => {
      active = false;

      wsRef.current?.close();
      wsRef.current = null;

      if (retryRef.current) {
        clearTimeout(retryRef.current);
      }
    };
  }, [user?.id, addNotification]);
};
