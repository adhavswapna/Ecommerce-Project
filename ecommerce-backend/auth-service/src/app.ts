import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes";

const app = express();

/* --------------------------------------------------
   GLOBAL MIDDLEWARES
-------------------------------------------------- */

// ✅ CORS (VERY IMPORTANT for frontend)
app.use(
  cors({
    origin: [
      "http://127.0.0.1:3000",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

// Security headers
app.use(helmet());

// Logging
app.use(morgan("dev"));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* --------------------------------------------------
   HEALTH CHECK
-------------------------------------------------- */

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "auth-service running",
  });
});

/* --------------------------------------------------
   ROUTES
-------------------------------------------------- */

app.use("/auth", authRoutes);

/* --------------------------------------------------
   404 HANDLER
-------------------------------------------------- */

app.use((_req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

/* --------------------------------------------------
   ERROR HANDLER
-------------------------------------------------- */

app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("❌ Error:", err);

    res.status(err.status || 500).json({
      message: err.message || "Internal Server Error",
    });
  }
);

export default app;

