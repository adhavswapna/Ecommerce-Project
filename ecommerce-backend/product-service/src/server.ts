import dotenv from "dotenv";
dotenv.config(); // ✅ LOAD ENV FIRST

import app from "./app";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PORT = process.env.PORT || 3003;

async function startServer() {
  try {
    // ✅ Check env
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is missing in .env");
    }

    // 🔥 Connect DB
    await prisma.$connect();
    console.log("✅ Database connected");

    // 🚀 Start server
    app.listen(PORT, () => {
      console.log(`🚀 Product Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect DB:", error);
    process.exit(1);
  }
}

startServer();
