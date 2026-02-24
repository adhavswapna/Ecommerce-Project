import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "../components/AuthProvider";
import Navbar from "../components/Navbar";

export const metadata: Metadata = {
  title: "Swapna Store",
  description: "Amazon-style ecommerce built by Swapna",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">
        <AuthProvider>
          {/* 🔷 Top Navbar */}
          <Navbar />

          {/* 🔷 Page Content */}
          <main className="max-w-7xl mx-auto px-4 py-6">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
