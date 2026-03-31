"use client";

import { useState } from "react";
import { useNotificationStore } from "@/store/notification.store";

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);

  const notifications = useNotificationStore(
    (state) => state.notifications
  );

  const markAsRead = useNotificationStore(
    (state) => state.markAsRead
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      {/* 🔔 Bell Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative text-xl"
      >
        🔔

        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* 📦 Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border shadow-lg rounded-md z-50 max-h-96 overflow-y-auto">

          <div className="p-3 border-b font-semibold">
            Notifications
          </div>

          {notifications.length === 0 ? (
            <p className="p-4 text-gray-500 text-sm">
              No notifications
            </p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className={`px-4 py-3 border-b cursor-pointer hover:bg-gray-100 ${
                  n.read ? "opacity-60" : "font-semibold"
                }`}
              >
                <p className="text-sm">{n.message}</p>
                <p className="text-xs text-gray-400">
                  {new Date(n.createdAt).toLocaleTimeString()}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
