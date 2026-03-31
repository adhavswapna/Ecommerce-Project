"use client";

import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import { useLiveNotification } from "@/hooks/useLiveNotification";
import MobileNotificationPanel from "@/components/notifications/MobileNotificationPanel";
import { Toaster } from "react-hot-toast"; // 🔥 toast system
import "./globals.css";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  // 🔔 Initialize WebSocket globally (only once)
  useLiveNotification();

  return (
    <html lang="en">
      <head>
        <title>ShopSphere</title>
        <meta name="description" content="ShopSphere e-commerce platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>

      <body className="bg-gray-50 text-gray-900">

        {/* 🔥 Global Toast Notifications */}
        <Toaster position="top-right" reverseOrder={false} />

        {/* ✅ Navbar */}
        <Navbar />

        {/* 📱 Mobile Notification Panel */}
        <MobileNotificationPanel />

        {/* ✅ Page Content */}
        <main className="pt-16 px-6 max-w-7xl mx-auto">
          {children}
        </main>

      </body>
    </html>
  );
}
