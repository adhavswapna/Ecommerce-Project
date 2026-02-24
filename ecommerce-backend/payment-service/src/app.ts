// src/app.ts
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import paymentRoutes from "./routes/payment.routes";

const app = express();

// Trust proxy (important for Docker / API Gateway / Nginx)
app.set("trust proxy", 1);

// ------------------------
// Security Middleware
// ------------------------
app.use(helmet());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Body parser
app.use(express.json({ limit: "1mb" }));

// Logger
app.use(morgan("dev"));

// ------------------------
// Health Check
// ------------------------
app.get("/health", (_req: Request, res: Response) => {
  return res.status(200).json({
    status: "UP",
    service: "Payment Service",
    timestamp: new Date().toISOString(),
  });
});

// ------------------------
// Routes
// ------------------------
app.use("/payments", paymentRoutes);

// ------------------------
// 404 Handler
// ------------------------
app.use((_req: Request, res: Response) => {
  return res.status(404).json({ message: "Route not found" });
});

// ------------------------
// Global Error Handler
// ------------------------
app.use(
  (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error("Unhandled Error:", err);
    return res.status(500).json({
      message: err.message || "Internal server error",
    });
  }
);

export default app;
