// src/app.ts

import express from "express";
import cors from "cors";

import notificationRoutes from "./routes/notification.routes";
import healthRoutes from "./routes/health.routes";

const app = express();

/**
 * CORS configuration
 * Frontend: Next.js running on localhost:3000
 * WebSocket remains separate on port 8080
 */
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// Handle preflight requests
app.options("*", cors());

app.use(express.json());

/**
 * Routes
 */
app.use("/health", healthRoutes);

app.use(
  "/notifications",
  notificationRoutes
);

export default app;
