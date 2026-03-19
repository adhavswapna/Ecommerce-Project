import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import productRoutes from "./routes/product.routes";

const app = express();

/* =========================
   Middleware
========================= */

// ✅ Fix helmet + CORS conflict
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// ✅ Proper CORS config (IMPORTANT)
app.use(
  cors({
    origin: "http://localhost:3000", // ⚠️ MUST be plain string (not markdown)
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ Handle preflight requests
app.options("*", cors());

app.use(express.json());
app.use(morgan("dev"));

/* =========================
   Routes
========================= */

app.use("/products", productRoutes);

/* =========================
   Health check
========================= */

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "UP", service: "Product Service" });
});

/* =========================
   Global error handling
========================= */

app.use(
  (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error("❌ Unhandled Error:", err);

    res.status(500).json({
      message: err.message || "Internal server error",
    });
  }
);

export default app;
