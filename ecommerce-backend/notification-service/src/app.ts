// src/app.ts

import express from "express";
import notificationRoutes from "./routes/notification.routes";
import healthRoutes from "./routes/health.routes";

const app = express();

app.use(express.json());

app.use("/health", healthRoutes);
app.use("/notifications", notificationRoutes);

export default app;
