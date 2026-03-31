import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import productRoutes from "./routes/product.routes";

const app = express();

/* ==================================================
   GLOBAL MIDDLEWARES
================================================== */

// ✅ Security headers (fix for cross-origin issues like images/files)
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// ✅ CORS (VERY IMPORTANT for frontend + WSL)
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://172.25.225.233:3000", // ✅ your WSL frontend
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Handle preflight requests (important for PUT/DELETE/auth headers)
app.options("*", cors());

// ✅ Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Logging
app.use(morgan("dev"));

/* ==================================================
   HEALTH CHECK
================================================== */

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "product-service running",
  });
});

/* ==================================================
   ROUTES
================================================== */

// 👉 Final endpoint: http://localhost:3003/products
app.use("/products", productRoutes);

/* ==================================================
   404 HANDLER
================================================== */

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    message: "Route not found",
  });
});

/* ==================================================
   GLOBAL ERROR HANDLER
================================================== */

app.use(
  (err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error("❌ Product Service Error:", err);

    res.status(err.status || 500).json({
      message: err.message || "Internal Server Error",
    });
  }
);

export default app;
