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
      </head>
      <body style={{ margin: 0, fontFamily: "Arial, sans-serif" }}>
        {/* Navbar appears on all pages */}
        <Navbar />

        {/* Main content */}
        <main style={{ padding: "2rem" }}>{children}</main>
      </body>
    </html>
  );
}
