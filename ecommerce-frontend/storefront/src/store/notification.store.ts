import { create } from "zustand";

export interface Notification {
  id: string;
  message: string;
  type: string;
  createdAt: string;
  read: boolean;
}

interface NotificationState {
  notifications: Notification[];

  addNotification: (n: Notification) => void;
  markAsRead: (id: string) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],

  // 🔔 Add new notification
  addNotification: (n) =>
    set((state) => ({
      notifications: [
        {
          ...n,
          read: false,
        },
        ...state.notifications,
      ],
    })),

  // 📖 Mark single notification as read
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),

  // 🧹 Clear all notifications
  clearNotifications: () =>
    set(() => ({
      notifications: [],
    })),
}));
