"use client";

import { ReactNode, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useLiveNotification } from "@/hooks/useLiveNotification";
import MobileNotificationPanel from "@/components/notifications/MobileNotificationPanel";
import { Toaster } from "react-hot-toast";
import "./globals.css";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  // 🔔 Initialize WebSocket safely
  useLiveNotification();

  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        {/* Toast */}
        <Toaster position="top-right" reverseOrder={false} />

        {/* Navbar */}
        <Navbar />

        {/* Notifications */}
        <MobileNotificationPanel />

        {/* Content */}
        <main className="pt-16 px-6 max-w-7xl mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
