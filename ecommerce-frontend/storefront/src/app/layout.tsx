"use client";

import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import "./globals.css";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <title>ShopSphere</title>
        <meta name="description" content="ShopSphere e-commerce platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>

      <body className="bg-gray-50 text-gray-900">
        {/* ✅ Navbar fixed at top */}
        <Navbar />

        {/* ✅ Page Content */}
        <main className="pt-16 px-6 max-w-7xl mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
