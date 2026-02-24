import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import productRoutes from "./routes/product.routes";

const app = express();

// ------------------------
// Middleware
// ------------------------
app.use(helmet());          // Security headers
app.use(cors());            // Allow frontend cross-origin requests
app.use(express.json());    // Parse JSON body
app.use(morgan("dev"));     // HTTP request logging

// ------------------------
// Routes
// ------------------------
app.use("/products", productRoutes);

// ------------------------
// Health check
// ------------------------
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "UP", service: "Product Service" });
});

// ------------------------
// Global error handling
// ------------------------
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ message: err.message || "Internal server error" });
});

export default app;

