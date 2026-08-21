import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes";

const app = express();


/* --------------------------------------------------
   GLOBAL MIDDLEWARES
-------------------------------------------------- */

// CORS is handled centrally by Nginx.
// Do NOT add cors() middleware here.

app.use(helmet());

app.use(morgan("dev"));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));


/* --------------------------------------------------
   HEALTH CHECK
-------------------------------------------------- */

// direct service
// curl http://localhost:3001/health
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "auth-service running",
  });
});


// gateway health
// curl http://localhost:8081/api/auth/health
// nginx forwards -> /auth/health
app.get("/auth/health", (_req, res) => {
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
