// next.config.ts

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      /**
       * =========================================
       * 🌍 LOCALHOST
       * =========================================
       */
      {
        protocol: "http",
        hostname: "localhost",
      },

      /**
       * =========================================
       * ☁️ AWS S3
       * =========================================
       */
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
      },

      /**
       * =========================================
       * 🪣 MINIO
       * =========================================
       */
      {
        protocol: "http",
        hostname: "minio",
      },

      {
        protocol: "http",
        hostname: "127.0.0.1",
      },

      /**
       * =========================================
       * 🖼️ PLACEHOLDER IMAGES
       * =========================================
       */
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },

      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },

      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },

  reactStrictMode: true,
};

export default nextConfig;
