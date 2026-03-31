"use client";

import { useNotificationStore } from "@/store/notification.store";

export default function MobileNotificationPanel() {
  const notifications = useNotificationStore(
    (state) => state.notifications
  );

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg max-h-96 overflow-y-auto">

      <div className="p-3 font-semibold border-b">
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
            className="px-4 py-3 border-b"
          >
            <p className="text-sm">{n.message}</p>
            <p className="text-xs text-gray-400">
              {new Date(n.createdAt).toLocaleTimeString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
