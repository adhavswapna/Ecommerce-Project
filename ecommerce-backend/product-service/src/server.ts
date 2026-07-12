import dotenv from "dotenv";
dotenv.config();

import http from "http";

import app from "./app";
import { prisma } from "./db/prisma/prisma";

const PORT = Number(process.env.PORT) || 3003;

async function startServer(): Promise<void> {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is missing in .env");
    }

    // Connect to PostgreSQL
    await prisma.$connect();
    console.log("✅ Database connected");

    const server = http.createServer(app);

    server.listen(PORT, () => {
      console.log(`🚀 Product Service running on port ${PORT}`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      console.log(`\n${signal} received. Shutting down Product Service...`);

      server.close(async () => {
        try {
          await prisma.$disconnect();
          console.log("✅ Database disconnected");
          process.exit(0);
        } catch (error) {
          console.error("❌ Error during shutdown:", error);
          process.exit(1);
        }
      });
    };

    process.on("SIGINT", () => void gracefulShutdown("SIGINT"));
    process.on("SIGTERM", () => void gracefulShutdown("SIGTERM"));
  } catch (error) {
    console.error("❌ Failed to start Product Service:", error);

    try {
      await prisma.$disconnect();
    } catch {
      // Ignore disconnect errors during startup failure
    }

    process.exit(1);
  }
}

void startServer();
