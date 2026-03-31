// src/hooks/useLiveNotification.ts

"use client";

import { useEffect, useState } from "react";

interface BadgeCounts {
  cart: number;
  payments: number;
  orders: number;
  returns: number;
  notifications: number;
}

export const useLiveNotification = (userId?: string) => {
  const [counts, setCounts] = useState<BadgeCounts>({
    cart: 0,
    payments: 0,
    orders: 0,
    returns: 0,
    notifications: 0,
  });

  useEffect(() => {
    if (!userId) return;

    let ws: WebSocket;

    const connect = () => {
      ws = new WebSocket("ws://localhost:8080");

      ws.onopen = () => console.log("✅ WS connected");

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.userId === userId) {
            setCounts((prev) => ({
              ...prev,
              ...data,
            }));
          }
        } catch (err) {
          console.error("WS parse error:", err);
        }
      };

      ws.onclose = () => {
        console.log("❌ WS disconnected, retrying...");
        setTimeout(connect, 3000); // auto reconnect
      };
    };

    connect();

    return () => ws?.close();
  }, [userId]);

  return counts;
};
